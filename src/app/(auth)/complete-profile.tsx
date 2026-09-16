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

export default function CompleteProfileScreen() {
  return (
    <ShellScreen
      eyebrow="Create Account"
      title="Complete your profile"
      description="A few details are needed to finish setting up your VoLTE Mobile customer account."
      headerAlign="center"
      header={
        <BrandLogo width={150} />
      }
    >
      <View style={styles.form}>
        <FormField
          label="Full name"
          placeholder="Your full name"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
        />

        <FormField
          label="Phone number"
          placeholder="876 555 0000"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
        />

        <Text style={styles.note}>
          If you already have a VoLTE Mobile
          customer profile, we'll securely link
          it rather than create a duplicate.
        </Text>

        <Button
          label="Create account"
          disabled
        />
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

  note: {
    color: Colors.text.secondary,
    fontSize:
      Typography.size.bodySmall,
    lineHeight:
      Typography.lineHeight.bodySmall,
    textAlign: 'center',
  },
});
