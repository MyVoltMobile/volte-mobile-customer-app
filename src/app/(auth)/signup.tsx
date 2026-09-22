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

const MAGENTA = '#F5007E';

export default function SignupScreen() {
  const router = useRouter();

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
                Start with your email
              </Text>

              <Text style={styles.description}>
                Verify your email to securely create
                or link your VoLTE Mobile customer
                account.
              </Text>
            </View>

            <View style={styles.card}>
              <FormField
                label="Email address"
                placeholder="you@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                helperText="We'll send a secure verification link to this email."
                style={styles.input}
              />

              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled: true,
                }}
                disabled
                style={[
                  styles.primaryButton,
                  styles.primaryButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    styles.primaryButtonTextDisabled,
                  ]}
                >
                  Verify email
                </Text>
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />

                <Text style={styles.dividerText}>
                  ALREADY A CUSTOMER?
                </Text>

                <View style={styles.divider} />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sign in"
                onPress={() =>
                  router.navigate('/login')
                }
                style={({ pressed }) => [
                  styles.secondaryButton,

                  pressed &&
                    styles.secondaryButtonPressed,
                ]}
              >
                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  Sign in
                </Text>
              </Pressable>
            </View>

            <Text style={styles.securityNote}>
              Secure account verification
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
    maxWidth: 400,
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

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EC',
  },

  dividerText: {
    color: '#8A91A0',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  secondaryButton: {
    minHeight: 56,
    width: '100%',
    borderWidth: 1,
    borderColor: '#DEE1E7',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F7F8FA',
  },

  secondaryButtonPressed: {
    backgroundColor: '#EFF1F4',
  },

  secondaryButtonText: {
    color: '#11131A',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
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
