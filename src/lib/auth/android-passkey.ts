import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Passkey } from 'react-native-passkey';
import { getSupabaseClient } from './supabase';

const enrolledKey = 'android-passkey-enrolled';

export async function hasAndroidPasskey() {
  return Platform.OS === 'android' && Passkey.isSupported() &&
    await SecureStore.getItemAsync(enrolledKey) === 'yes';
}

export async function enrollAndroidPasskey() {
  if (Platform.OS !== 'android' || !Passkey.isSupported()) {
    throw new Error('Passkey setup is unavailable on this phone.');
  }
  const api = getSupabaseClient().auth.passkey;
  const { data, error } = await api.startRegistration();
  if (error || !data) throw new Error('Could not start passkey setup.');
  const credential = await Passkey.create(data.options as Parameters<typeof Passkey.create>[0]);
  const result = await api.verifyRegistration({ challengeId: data.challenge_id,
    credential: credential as Parameters<typeof api.verifyRegistration>[0]['credential'] });
  if (result.error) throw result.error;
  await SecureStore.setItemAsync(enrolledKey, 'yes');
}

export async function signInWithAndroidPasskey() {
  const api = getSupabaseClient().auth.passkey;
  const { data, error } = await api.startAuthentication();
  if (error || !data) throw new Error('Could not start passkey sign-in.');
  const credential = await Passkey.get(data.options as Parameters<typeof Passkey.get>[0]);
  const result = await api.verifyAuthentication({ challengeId: data.challenge_id,
    credential: credential as Parameters<typeof api.verifyAuthentication>[0]['credential'] });
  if (result.error || !result.data?.session) throw new Error('Passkey sign-in failed.');
}
