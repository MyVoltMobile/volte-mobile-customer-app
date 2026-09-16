import {
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BrandLogo } from '@/components/brand/brand-logo';
import { ShellScreen } from '@/components/shell/shell-screen';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { createAuthRedirectUrl } from '@/lib/auth/redirect';
import { getSupabaseClient } from '@/lib/auth/supabase';
import {
  Colors,
  Spacing,
  Typography,
} from '@/theme/tokens';

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

  return (
    <ShellScreen
      eyebrow="Customer Account"
      title="Welcome back"
      description="Sign in to securely access your VoLTE Mobile account."
      headerAlign="center"
      header={
        <BrandLogo width={150} />
      }
    >
      <View style={styles.form}>
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
        />

        <Button
          label={
            sending
              ? 'Sending...'
              : 'Sign in'
          }
          onPress={
            requestSignInLink
          }
          disabled={
            sending ||
            !emailLooksValid
          }
        />

        {message ? (
          <Text
            style={styles.message}
          >
            {message}
          </Text>
        ) : null}
      </View>
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },

  message: {
    color: Colors.text.secondary,
    fontSize:
      Typography.size.bodySmall,
    lineHeight:
      Typography.lineHeight.bodySmall,
    fontWeight: '500',
    textAlign: 'center',
  },
});
