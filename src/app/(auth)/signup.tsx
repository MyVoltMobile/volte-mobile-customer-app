import { useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  BrandLogo,
} from '@/components/brand/brand-logo';
import {
  ShellScreen,
} from '@/components/shell/shell-screen';
import {
  Button,
} from '@/components/ui/button';
import {
  FormField,
} from '@/components/ui/form-field';
import {
  Colors,
  Spacing,
  Typography,
} from '@/theme/tokens';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <ShellScreen
      eyebrow="Create Account"
      title="Start with your email"
      description="Verify your email to securely create or link your VoLTE Mobile customer account."
      headerAlign="center"
      header={
        <BrandLogo width={150} />
      }
    >
      <View style={styles.form}>
        <FormField
          label="Email address"
          placeholder="you@example.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          helperText="We'll send a secure verification link to this email."
        />

        <Button
          label="Verify email"
          disabled
        />

        <View style={styles.signIn}>
          <Text style={styles.signInText}>
            Already have an account?
          </Text>

          <Button
            label="Sign in"
            variant="secondary"
            onPress={() =>
              router.navigate('/login')
            }
          />
        </View>
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

  signIn: {
    width: '100%',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },

  signInText: {
    color: Colors.text.secondary,
    fontSize:
      Typography.size.bodySmall,
    lineHeight:
      Typography.lineHeight.bodySmall,
    textAlign: 'center',
  },
});
