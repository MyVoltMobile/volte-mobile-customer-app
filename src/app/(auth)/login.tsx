import {
  useState,
} from 'react';

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
  createAuthRedirectUrl,
} from '@/lib/auth/redirect';

import {
  getSupabaseClient,
} from '@/lib/auth/supabase';

const MAGENTA = '#F5007E';

export default function LoginScreen() {
  const [email, setEmail] =
    useState('');

  const [sending, setSending] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const normalizedEmail =
    email.trim().toLowerCase();

  const emailLooksValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalizedEmail,
    );

  async function requestSignInLink() {
    if (
      sending ||
      !emailLooksValid
    ) {
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const supabase =
        getSupabaseClient();

      const redirectTo =
        createAuthRedirectUrl(
          'sign-in',
        );

      const {
        error,
      } =
        await supabase.auth
          .signInWithOtp({
            email:
              normalizedEmail,

            options: {
              emailRedirectTo:
                redirectTo,

              shouldCreateUser:
                false,
            },
          });

      if (error) {
        throw error;
      }

      setMessage(
        'Check your email for your secure sign-in link.',
      );
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message
              .toLowerCase()
          : '';

      if (
        detail.includes(
          'rate limit',
        )
      ) {
        setMessage(
          'Too many sign-in attempts. Please wait a few minutes and try again.',
        );
      } else {
        setMessage(
          'We could not send a secure sign-in link. Please check your email and try again.',
        );
      }
    } finally {
      setSending(false);
    }
  }

  const disabled =
    sending ||
    !emailLooksValid;

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
                CUSTOMER ACCOUNT
              </Text>

              <Text style={styles.title}>
                Welcome back
              </Text>

              <Text style={styles.description}>
                Sign in securely to access your
                VoLTE Mobile account.
              </Text>
            </View>

            <View style={styles.card}>
              <FormField
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);

                  if (message) {
                    setMessage('');
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                editable={!sending}
                helperText="We'll send a secure sign-in link to your email."
                style={styles.input}
              />

              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled,
                }}
                disabled={disabled}
                onPress={
                  requestSignInLink
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
                  {sending
                    ? 'Sending...'
                    : 'Sign in'}
                </Text>
              </Pressable>

              {message ? (
                <Text style={styles.message}>
                  {message}
                </Text>
              ) : null}
            </View>

            <Text style={styles.securityNote}>
              Secure email sign-in · No password required
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
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.8,
    textAlign: 'center',
  },

  description: {
    maxWidth: 360,
    marginTop: 10,
    color: '#B9BDC8',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '400',
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
    letterSpacing: -0.2,
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
