import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BrandLogo } from '@/components/brand/brand-logo';
import { Button } from '@/components/ui/button';
import { ShellScreen } from '@/components/shell/shell-screen';
import {
  Colors,
  Spacing,
  Typography,
} from '@/theme/tokens';

export default function LoginScreen() {
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
      <View style={styles.authPlaceholder}>
        <Text style={styles.authPlaceholderText}>
          Secure sign-in coming next
        </Text>
      </View>

      <Button
        label="Sign in"
        disabled
      />
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  authPlaceholder: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },

  authPlaceholderText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontWeight: '500',
    textAlign: 'center',
  },
});
