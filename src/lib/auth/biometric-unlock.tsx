import { enrollAndroidPasskey } from './android-passkey';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/auth/supabase';

const key = (id: string) => 'biometric-unlock.' + id;

async function unlock() {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock VoLTE Mobile',
    disableDeviceFallback: true,
    biometricsSecurityLevel: 'strong',
  });
  return result.success;
}

export function BiometricSettings({ customerId }: { customerId: string }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    SecureStore.getItemAsync(key(customerId))
      .then((value) => setEnabled(value === 'enabled'))
      .catch(() => setMessage('Fingerprint settings are unavailable.'));
  }, [customerId]);

  if (Platform.OS !== 'android') return null;

  async function toggle() {
    setBusy(true);
    setMessage('');
    try {
      if (enabled) {
        await SecureStore.deleteItemAsync(key(customerId));
        setEnabled(false);
      } else {
        const level = await LocalAuthentication.getEnrolledLevelAsync();
        if (level !== LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG) {
          setMessage('Set up a supported fingerprint in Android settings first.');
          return;
        }
        if (!await unlock()) return;
        await SecureStore.setItemAsync(key(customerId), 'enabled');
        setEnabled(true);
      }
    } catch {
      setMessage('Fingerprint settings could not be updated.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.actions}>
      <Button variant="secondary" disabled={busy || enabled === null}
        label={enabled ? 'Turn off fingerprint unlock' : 'Enable fingerprint unlock'}
        onPress={() => void toggle()} />
      <Button label="Set up fingerprint sign-in" variant="secondary" disabled={busy}
        onPress={() => {
          setBusy(true);
          setMessage('');
          void enrollAndroidPasskey()
            .then(({ message }) => setMessage(message))
            .finally(() => setBusy(false));
        }} />
      {!!message && <Text accessibilityLiveRegion="polite">{message}</Text>}
    </View>
  );
}

export function BiometricGate({ customerId, children }: { customerId: string; children: ReactNode }) {
  const [state, setState] = useState<'checking' | 'locked' | 'open'>('checking');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const running = useRef(false);

  useEffect(() => {
    let active = true;
    if (Platform.OS !== 'android') return;
    SecureStore.getItemAsync(key(customerId))
      .then((value) => { if (active) setState(value === 'enabled' ? 'locked' : 'open'); })
      .catch(() => { if (active) setState('locked'); });
    return () => { active = false; };
  }, [customerId]);

  if (Platform.OS !== 'android' || state === 'open') return <>{children}</>;

  async function act(useEmail: boolean) {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setMessage('');
    try {
      if (useEmail) {
        const { error } = await getSupabaseClient().auth.signOut({ scope: 'local' });
        if (error) throw error;
        await SecureStore.deleteItemAsync(key(customerId));
      } else if (await unlock()) {
        setState('open');
      } else {
        setMessage('Fingerprint verification was not completed.');
      }
    } catch {
      setMessage(useEmail ? 'Could not return to email sign-in. Try again.' : 'Fingerprint unlock is unavailable.');
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  return (
    <View style={styles.screen}>
      {state === 'checking' ? <ActivityIndicator /> : (
        <View style={styles.card}>
          <Image
            source={require('../../../assets/brand/volte-mobile-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text accessibilityRole="header" style={styles.title}>Unlock VoLTE Mobile</Text>
          <Text style={styles.description}>Use your fingerprint to return to your account.</Text>
          <Button label="Unlock with fingerprint" disabled={busy} onPress={() => void act(false)} />
          <Button label="Sign in by email" variant="secondary" disabled={busy} onPress={() => {
            Alert.alert('Sign in by email?', 'This resets fingerprint unlock on this device.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Continue', onPress: () => void act(true) },
            ]);
          }} />
          {!!message && <Text accessibilityLiveRegion="polite">{message}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F5F5F7' },
  actions: { gap: 12 },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    padding: 24,
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  logo: { width: 56, height: 56, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#11131A', textAlign: 'center' },
  description: { fontSize: 15, lineHeight: 22, color: '#525865', textAlign: 'center' },
});
