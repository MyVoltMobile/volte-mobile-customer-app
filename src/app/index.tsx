import {
  Redirect,
  useRouter,
} from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/brand/brand-logo';
import { Button } from '@/components/ui/button';
import { AppIdentity } from '@/config/app';
import {
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';
import {
  Colors,
  Spacing,
  Typography,
} from '@/theme/tokens';

export default function WelcomeScreen() {
  const router = useRouter();

  const {
    status,
  } = useCustomerSession();

  if (status === 'loading') {
    return (
      <SafeAreaView
        style={styles.screen}
      >
        <ActivityIndicator
          size="small"
          style={{
            alignSelf: 'center',
          }}
        />
      </SafeAreaView>
    );
  }

  if (
    status === 'authenticated'
  ) {
    return (
      <Redirect href="/home" />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <BrandLogo width={210} />

        <View style={styles.copy}>
          <Text style={styles.title}>
            Your VoLTE Mobile account,
            all in one place.
          </Text>

          <Text style={styles.description}>
            Manage your devices, purchases,
            finance and support from your
            secure customer account.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            label="Sign in"
            onPress={() => router.navigate('/login')}
          />

          <Button
            label="Create account"
            variant="secondary"
            onPress={() =>
              router.navigate('/signup')
            }
          />
        </View>

        <Text style={styles.tagline}>
          {AppIdentity.tagline}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background.app,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
    justifyContent: 'center',
  },

  content: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    gap: Spacing.xxl,
  },

  copy: {
    gap: Spacing.md,
    alignItems: 'center',
  },

  title: {
    color: Colors.text.primary,
    fontSize: Typography.size.display,
    lineHeight: Typography.lineHeight.display,
    fontWeight: '800',
    letterSpacing: -0.7,
    textAlign: 'center',
  },

  description: {
    color: Colors.text.secondary,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    textAlign: 'center',
  },

  actions: {
    gap: Spacing.md,
  },

  tagline: {
    color: Colors.brand.secondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontWeight: '700',
    textAlign: 'center',
  },
});
