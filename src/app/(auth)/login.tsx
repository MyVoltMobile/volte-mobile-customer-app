import {
  useEffect,
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
  useRouter,
} from 'expo-router';

import {
  FormField,
} from '@/components/ui/form-field';

import {
  createAuthRedirectUrl,
} from '@/lib/auth/redirect';

import {
  getSupabaseClient,
} from '@/lib/auth/supabase';

import {
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';

import { customerApiBaseUrl } from '@/lib/customer/customer-api';

const MAGENTA = '#F5007E';

const GOOGLE_PLAY_REVIEW_EMAIL =
  'playreview@voltemobile.com';

export default function LoginScreen() {
  const router =
    useRouter();

  const {
    verifyCustomerSession,
  } = useCustomerSession();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [sending, setSending] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [signInImage, setSignInImage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadImage() {
      try {
        const response = await fetch(`${customerApiBaseUrl()}/api/public/app-sign-in-image`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!controller.signal.aborted && typeof data.imageUrl === 'string' && data.imageUrl.startsWith('https://')) {
          setSignInImage(data.imageUrl);
        }
      } catch {
        // Keep the bundled sign-in artwork when the service is unavailable.
      }
    }
    void loadImage();
    return () => controller.abort();
  }, []);

  const normalizedEmail =
    email.trim().toLowerCase();

  const emailLooksValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalizedEmail,
    );

  const isGooglePlayReviewer =
    normalizedEmail ===
    GOOGLE_PLAY_REVIEW_EMAIL;

  async function requestReviewerSignIn() {
    if (
      sending ||
      !emailLooksValid ||
      !password
    ) {
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const supabase =
        getSupabaseClient();

      const {
        data,
        error,
      } =
        await supabase.auth
          .signInWithPassword({
            email:
              normalizedEmail,
            password,
          });

      if (
        error ||
        !data.session
      ) {
        throw (
          error ||
          new Error(
            'No authenticated session was returned.',
          )
        );
      }

      await verifyCustomerSession(
        data.session,
      );

      router.replace('/home');
    } catch {
      setMessage(
        'Reviewer sign-in could not be completed. Please check the review credentials and try again.',
      );
    } finally {
      setSending(false);
    }
  }

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
    !emailLooksValid ||
    (
      isGooglePlayReviewer &&
      !password
    );

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
                source={signInImage ? { uri: signInImage } : require('../../../assets/brand/volte-mobile-icon.png')}
                onError={() => setSignInImage(null)}
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
                helperText={
                    isGooglePlayReviewer
                      ? 'Use the reviewer password provided in Google Play Console.'
                      : "We'll send a secure sign-in link to your email."
                  }
                style={styles.input}
              />

              {isGooglePlayReviewer ? (
                <FormField
                  label="Review password"
                  placeholder="Enter review password"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);

                    if (message) {
                      setMessage('');
                    }
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  autoComplete="password"
                  textContentType="password"
                  editable={!sending}
                  helperText="Google Play reviewer access"
                  style={styles.input}
                />
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled,
                }}
                disabled={disabled}
                onPress={
                  isGooglePlayReviewer
                    ? requestReviewerSignIn
                    : requestSignInLink
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
                    ? (
                      isGooglePlayReviewer
                        ? 'Signing in...'
                        : 'Sending...'
                    )
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
              {isGooglePlayReviewer
                ? 'Secure Google Play reviewer access'
                : 'Secure email sign-in · No password required'}
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
