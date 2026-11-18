import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShellScreen } from '@/components/shell/shell-screen';
import { enableCustomerAlerts, notificationRequest } from '@/lib/customer/customer-notifications';
import { Colors, Spacing, Typography } from '@/theme/tokens';

type Message = { id: string; title: string; body: string; created_at: string; read_at: string | null };

export default function NotificationsScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [updating, setUpdating] = useState(false);
  const version = useRef(0);

  const load = useCallback(async (nextPage: number) => {
    const request = ++version.current;
    setLoading(true);
    setLoadError('');
    try {
      const result = await notificationRequest('?page=' + nextPage);
      if (!Array.isArray(result.notifications)) throw new Error('Notifications could not be loaded.');
      if (request !== version.current) return;
      setMessages(result.notifications);
      setPage(nextPage);
      setHasMore(result.hasMore === true);
    } catch (error) {
      if (request === version.current) setLoadError(error instanceof Error ? error.message : 'Notifications could not be loaded.');
    } finally {
      if (request === version.current) setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void load(0);
    return () => { version.current += 1; };
  }, [load]));

  async function update(id?: string) {
    setUpdating(true);
    setFeedback('');
    try {
      if (id) {
        await notificationRequest('', { action: 'read', id });
        await load(page);
      } else {
        await enableCustomerAlerts();
        setFeedback('Android alerts enabled.');
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'The update could not be saved.');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <ShellScreen eyebrow="Account" title="Notifications" description="Messages from VoLTE Mobile.">
      <View style={styles.list}>
        {Platform.OS === 'android' && <Button label="Enable Android alerts" variant="secondary"
          disabled={updating} onPress={() => void update()} />}
        {!!feedback && <Text accessibilityLiveRegion="polite" style={styles.body}>{feedback}</Text>}
        {loading ? <ActivityIndicator accessibilityLabel="Loading notifications" /> : loadError ? (
          <>
            <Text style={styles.body}>{loadError}</Text>
            <Button label="Try again" onPress={() => void load(page)} />
          </>
        ) : (
          <>
            {messages.length === 0 && <Card><Text style={styles.body}>No notifications yet.</Text></Card>}
            {messages.map((message) => (
              <Card key={message.id}>
                <View style={styles.list}>
                  <Text style={styles.title}>{message.title}</Text>
                  <Text style={styles.body}>{message.body}</Text>
                  <Text style={styles.body}>{new Date(message.created_at).toLocaleDateString()}</Text>
                  {!message.read_at && <Button label="Mark as read" variant="secondary"
                    disabled={updating} onPress={() => void update(message.id)} />}
                </View>
              </Card>
            ))}
            {page > 0 && <Button label="Newer messages" variant="secondary" onPress={() => void load(page - 1)} />}
            {hasMore && <Button label="Older messages" variant="secondary" onPress={() => void load(page + 1)} />}
          </>
        )}
      </View>
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.md },
  title: { color: Colors.text.primary, fontSize: Typography.size.titleSmall, fontWeight: '700' },
  body: { color: Colors.text.secondary, fontSize: Typography.size.body },
});
