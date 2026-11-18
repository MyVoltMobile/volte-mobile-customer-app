import { useCallback, useEffect, useState } from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppState, Platform } from 'react-native';
import { authenticatedCustomerFetch } from '@/lib/customer/customer-api';

export const notificationChannel = 'customer-updates';

export async function notificationRequest(path = '', body?: object) {
  const response = await authenticatedCustomerFetch('/api/public/customer-notifications' + path, body ? {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  } : { method: 'GET' });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) throw new Error(result?.error ?? 'Notifications are temporarily unavailable.');
  return result;
}

export function useUnreadCustomerNotifications() {
  const [hasUnread, setHasUnread] = useState(false);

  useFocusEffect(useCallback(() => {
    let current = true;
    let revision = 0;

    async function refresh() {
      if (AppState.currentState === 'background') return;
      const request = ++revision;
      try {
        for (let page = 0; current && request === revision; page += 1) {
          const result = await notificationRequest('?page=' + page);
          if (!current || request !== revision || !Array.isArray(result.notifications)) return;

          const unread = result.notifications.some((message: { read_at?: string | null }) =>
            message.read_at === null);
          if (unread || result.hasMore !== true || result.notifications.length === 0) {
            setHasUnread(unread);
            return;
          }
        }
      } catch {
        // Retain the last known indicator when the inbox is temporarily unavailable.
      }
    }

    void refresh();
    const push = Notifications.addNotificationReceivedListener(() => { void refresh(); });
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });
    const interval = setInterval(() => { void refresh(); }, 60000);

    return () => {
      current = false;
      push.remove();
      appState.remove();
      clearInterval(interval);
    };
  }, []));

  return hasUnread;
}

export async function enableCustomerAlerts() {
  await Notifications.setNotificationChannelAsync(notificationChannel, {
    name: 'VoLTE Mobile updates',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted && !(await Notifications.requestPermissionsAsync()).granted) {
    throw new Error('Allow VoLTE Mobile notifications in Android settings to receive alerts.');
  }
  const projectId = Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) throw new Error('Android alerts are unavailable in this build.');
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  await notificationRequest('', { action: 'register', token: token.data });
}

export function CustomerNotificationAlerts() {
  const router = useRouter();
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false,
      }),
    });
    const openInbox = (response: Notifications.NotificationResponse | null) => {
      if (response?.notification.request.content.data?.screen !== 'notifications') return;
      Notifications.clearLastNotificationResponse();
      router.push('/notifications');
    };
    const subscription = Notifications.addNotificationResponseReceivedListener(openInbox);
    openInbox(Notifications.getLastNotificationResponse());
    return () => {
      subscription.remove();
      Notifications.setNotificationHandler(null);
    };
  }, [router]);
  return null;
}
