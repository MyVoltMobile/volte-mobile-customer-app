import { useEffect, useState } from 'react';
import { customerApiBaseUrl } from '@/lib/customer/customer-api';

import {
  Redirect,
  useRouter,
} from 'expo-router';

import {
  StatusBar,
} from 'expo-status-bar';

import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  AppIdentity,
} from '@/config/app';

import {
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';

const LOGIN_HERO = require(
  '../../assets/brand/volte-mobile-login-hero.png',
);

const MAGENTA = '#F5007E';

export default function WelcomeScreen() {
  const router = useRouter();
  const [heroUrl, setHeroUrl] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWelcomeImage() {
      try {
        const response = await fetch(`${customerApiBaseUrl()}/api/public/app-sign-in-image`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!controller.signal.aborted && typeof data.imageUrl === 'string' && data.imageUrl.startsWith('https://')) {
          setHeroUrl(data.imageUrl);
        }
      } catch {
        // Keep the bundled welcome image when the ERP is unavailable.
      }
    }

    void loadWelcomeImage();
    return () => controller.abort();
  }, []);

  const {
    status,
  } = useCustomerSession();

  if (
    status === 'authenticated'
  ) {
    return (
      <Redirect href="/home" />
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ImageBackground
        source={heroUrl ? { uri: heroUrl } : LOGIN_HERO}
        onError={() => setHeroUrl(null)}
        resizeMode="cover"
        style={styles.background}
      >
        <View
          pointerEvents="none"
          style={styles.softShade}
        />

        <View
          pointerEvents="none"
          style={styles.bottomShade}
        />

        {status === 'loading' ? (
          <SafeAreaView
            style={styles.loading}
          >
            <ActivityIndicator
              color="#FFFFFF"
              size="small"
            />
          </SafeAreaView>
        ) : (
          <SafeAreaView
            style={styles.safeArea}
          >
            <View style={styles.content}>
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Sign in"
                  onPress={() =>
                    router.navigate('/login')
                  }
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed &&
                      styles.buttonPressed,
                  ]}
                >
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    Sign in
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Create account"
                  onPress={() =>
                    router.navigate('/signup')
                  }
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed &&
                      styles.buttonPressed,
                  ]}
                >
                  <Text
                    style={
                      styles.secondaryButtonText
                    }
                  >
                    Create account
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.tagline}>
                {AppIdentity.tagline}
              </Text>
            </View>
          </SafeAreaView>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050507',
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  softShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor:
      'rgba(0, 0, 0, 0.04)',
  },

  bottomShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '39%',
    backgroundColor:
      'rgba(5, 3, 8, 0.30)',
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingBottom: 30,
  },

  actions: {
    width: '100%',
    gap: 14,
  },

  primaryButton: {
    width: '100%',
    minHeight: 58,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: MAGENTA,
  },

  secondaryButton: {
    width: '100%',
    minHeight: 58,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },

  buttonPressed: {
    opacity: 0.88,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.25,
  },

  secondaryButtonText: {
    color: '#11131A',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.25,
  },

  tagline: {
    marginTop: 28,
    marginBottom: 6,
    color: MAGENTA,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
});
