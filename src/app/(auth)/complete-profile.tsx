import {
  useState,
} from 'react';

import {
  useRouter,
} from 'expo-router';

import {
  StatusBar,
} from 'expo-status-bar';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  FormField,
} from '@/components/ui/form-field';

import {
  getSupabaseClient,
} from '@/lib/auth/supabase';

import {
  authenticatedCustomerFetch,
} from '@/lib/customer/customer-api';

import {
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';

const MAGENTA = '#F5007E';

type RegistrationPayload = {
  ok?: unknown;
  error?: unknown;
};

function payloadError(
  value: unknown,
) {
  if (
    typeof value === 'string' &&
    value.trim()
  ) {
    return value.trim();
  }

  return '';
}

export default function CompleteProfileScreen() {
  const router = useRouter();

  const {
    verifyCustomerSession,
  } = useCustomerSession();

  const [fullName, setFullName] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const normalizedName =
    fullName.trim();

  const normalizedPhone =
    phone.trim();

  const phoneDigits =
    normalizedPhone.replace(
      /\D/g,
      '',
    );

  const formValid =
    normalizedName.length >= 2 &&
    phoneDigits.length >= 7;

  const disabled =
    submitting ||
    !formValid;

  async function completeRegistration() {
    if (disabled) {
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const response =
        await authenticatedCustomerFetch(
          '/api/public/customer-register',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              full_name:
                normalizedName,
              phone:
                normalizedPhone,
            }),
          },
        );

      let payload:
        RegistrationPayload | null =
          null;

      try {
        payload =
          (await response.json()) as
            RegistrationPayload;
      } catch {
        payload = null;
      }

      if (
        !response.ok ||
        payload?.ok !== true
      ) {
        throw new Error(
          payloadError(
            payload?.error,
          ) ||
            'Your VoLTE Mobile account could not be created.',
        );
      }

      const supabase =
        getSupabaseClient();

      const {
        data,
        error,
      } =
        await supabase.auth
          .getSession();

      if (
        error ||
        !data.session
      ) {
        throw new Error(
          'Your secure session could not be loaded after registration.',
        );
      }

      await verifyCustomerSession(
        data.session,
      );

      router.replace('/home');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Your VoLTE Mobile account could not be created. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.brand}>
              <Image
                accessibilityLabel="VoLTE Mobile"
                resizeMode="contain"
                source={require(
                  '../../../assets/brand/volte-mobile-icon.png'
                )}
                style={styles.brandIcon}
              />
            </View>

            <View style={styles.intro}>
              <Text style={styles.eyebrow}>
                CREATE ACCOUNT
              </Text>

              <Text style={styles.title}>
                Complete your profile
              </Text>

              <Text style={styles.description}>
                Add the basic details needed to
                finish setting up your VoLTE Mobile
                customer account.
              </Text>
            </View>

            <View style={styles.card}>
              <FormField
                label="Full name"
                placeholder="Your full name"
                value={fullName}
                onChangeText={(value) => {
                  setFullName(value);

                  if (message) {
                    setMessage('');
                  }
                }}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                editable={!submitting}
                style={styles.input}
              />

              <FormField
                label="Phone number"
                placeholder="876 555 0000"
                value={phone}
                onChangeText={(value) => {
                  setPhone(value);

                  if (message) {
                    setMessage('');
                  }
                }}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                editable={!submitting}
                style={styles.input}
              />

              <Text style={styles.note}>
                If you already have a VoLTE Mobile
                customer profile with this verified
                email, we will securely link it
                instead of creating a duplicate.
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled,
                }}
                disabled={disabled}
                onPress={
                  completeRegistration
                }
                style={({ pressed }) => [
                  styles.primaryButton,

                  disabled &&
                    styles.primaryButtonDisabled,

                  pressed &&
                    !disabled &&
                    styles.primaryButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.primaryButtonText,

                    disabled &&
                      styles.primaryButtonTextDisabled,
                  ]}
                >
                  {submitting
                    ? 'Creating account...'
                    : 'Create account'}
                </Text>
              </Pressable>

              {message ? (
                <Text style={styles.message}>
                  {message}
                </Text>
              ) : null}
            </View>

            <Text style={styles.securityNote}>
              Your verified email is used as the secure
              account identity.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050507',
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 34,
  },

  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  brand: {
    alignItems: 'center',
    marginBottom: 26,
  },

  brandIcon: {
    width: 46,
    height: 50,
  },

  intro: {
    alignItems: 'center',
  },

  eyebrow: {
    color: MAGENTA,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.25,
  },

  title: {
    maxWidth: 420,
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.8,
    textAlign: 'center',
  },

  description: {
    maxWidth: 390,
    marginTop: 10,
    color: '#B9BDC8',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },

  card: {
    width: '100%',
    marginTop: 30,
    padding: 22,
    gap: 20,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },

  input: {
    minHeight: 56,
    borderRadius: 16,
    borderColor: '#E1E4EA',
    backgroundColor: '#F6F7F9',
  },

  note: {
    color: '#697185',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  primaryButton: {
    minHeight: 58,
    width: '100%',
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: MAGENTA,
  },

  primaryButtonPressed: {
    opacity: 0.88,
  },

  primaryButtonDisabled: {
    backgroundColor: '#E9EBEF',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },

  primaryButtonTextDisabled: {
    color: '#8A91A0',
  },

  message: {
    color: '#697185',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center',
  },

  securityNote: {
    marginTop: 20,
    color: '#777D89',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});
