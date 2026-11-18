import { useEffect } from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
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
