import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Passkey } from 'react-native-passkey';
import { getSupabaseClient } from './supabase';

const enrolledKey = 'android-passkey-enrolled';

export async function hasAndroidPasskey() {
  return Platform.OS === 'android' && Passkey.isSupported() &&
    await SecureStore.getItemAsync(enrolledKey) === 'yes';
}

const setupMessages = {
  unavailable: 'Passkey setup is unavailable on this device. (FP-01)',
  options: 'Could not start passkey setup. (FP-02)',
  create: 'Android could not complete passkey creation. (FP-03)',
  verify: 'The app could not verify the passkey with VoLTE Mobile. (FP-04)',
  save: 'The passkey was verified, but this device could not save setup status. (FP-05)',
};

export async function enrollAndroidPasskey() {
  let stage: keyof typeof setupMessages = 'unavailable';
  let relyingPartyId: string | undefined;
  try {
    if (Platform.OS !== 'android' || !Passkey.isSupported()) {
      throw new Error();
    }

    stage = 'options';
    const api = getSupabaseClient().auth.passkey;
    const { data, error } = await api.startRegistration();
    if (error || !data) throw error ?? new Error();

    stage = 'create';
    const options = data.options as Parameters<typeof Passkey.create>[0];
    relyingPartyId = options.rp?.id;
    const credential = await Passkey.create(options);

    stage = 'verify';
    const result = await api.verifyRegistration({
      challengeId: data.challenge_id,
      credential: credential as Parameters<typeof api.verifyRegistration>[0]['credential'],
    });
    if (result.error) throw result.error;

    stage = 'save';
    await SecureStore.setItemAsync(enrolledKey, 'yes');
    return { message: 'Fingerprint sign-in is ready.' };
  } catch (error: unknown) {
    const fields = typeof error === 'object' && error !== null
      ? error as { code?: unknown; error?: unknown; message?: unknown }
      : {};
    const code = stage === 'create' ? fields.error ?? fields.code : fields.code;
    const invalidRp = stage === 'create' && typeof fields.message === 'string'
      && /(?:rp id|relying party id).*(?:validat|invalid)/i.test(fields.message);
    // Expose diagnostic categories without displaying the provider's raw message.
    const detail = invalidRp ? ' [RelyingPartyIdValidationFailed]'
      : typeof code === 'string' && /^[a-z][a-z0-9_]{1,63}$/i.test(code) ? ` [${code}]`
      : stage === 'create' ? (code === 'Native error' ? ' [NativeError]' : ' [UnknownError]')
      : '';
    const domain = invalidRp && typeof relyingPartyId === 'string'
      && /^(?=.{1,253}$)[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(relyingPartyId)
      ? ` Domain: ${relyingPartyId}.`
      : '';
    return { message: setupMessages[stage] + detail + domain };
  }
}

export async function signInWithAndroidPasskey() {
  const api = getSupabaseClient().auth.passkey;
  const { data, error } = await api.startAuthentication();
  if (error || !data) throw new Error('Could not start passkey sign-in.');
  const credential = await Passkey.get(data.options as Parameters<typeof Passkey.get>[0]);
  const result = await api.verifyAuthentication({ challengeId: data.challenge_id,
    credential: credential as Parameters<typeof api.verifyAuthentication>[0]['credential'] });
  if (result.error || !result.data?.session) throw new Error('Passkey sign-in failed.');
  return result.data.session;
}
