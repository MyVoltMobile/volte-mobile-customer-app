import {
  useRouter,
} from 'expo-router';

import {
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Card,
} from '@/components/ui/card';

import {
  ShellScreen,
} from '@/components/shell/shell-screen';

import {
  getSupabaseClient,
} from '@/lib/auth/supabase';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

function MenuRow({
  title,
  description,
  onPress,
  disabled = false,
  trailing,
}: {
  title: string;
  description: string;
  onPress?: () => void;
  disabled?: boolean;
  trailing?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled,
      }}
      disabled={
        disabled ||
        !onPress
      }
      onPress={onPress}
      style={({
        pressed,
      }) => [
        styles.menuRow,
        pressed &&
          !disabled &&
          styles.menuRowPressed,
      ]}
    >
      <View
        style={
          styles.menuText
        }
      >
        <Text
          style={
            styles.menuTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.menuDescription
          }
        >
          {description}
        </Text>
      </View>

      <Text
        style={
          disabled
            ? styles.menuTrailingMuted
            : styles.menuTrailing
        }
      >
        {trailing ||
          (disabled
            ? 'Soon'
            : '›')}
      </Text>
    </Pressable>
  );
}

export default function MoreScreen() {
  const router =
    useRouter();

  const [
    signingOut,
    setSigningOut,
  ] =
    useState(false);

  const [
    signOutError,
    setSignOutError,
  ] =
    useState('');

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);
    setSignOutError('');

    try {
      const supabase =
        getSupabaseClient();

      const {
        error,
      } =
        await supabase.auth
          .signOut();

      if (error) {
        throw error;
      }
    } catch {
      setSignOutError(
        'We could not sign you out. Please try again.',
      );

      setSigningOut(false);
    }
  }

  return (
    <ShellScreen
      eyebrow="Account"
      title="More"
      description="Account tools, preferences and more from VoLTE Mobile."
    >
      <View
        style={
          styles.content
        }
      >
        <Card>
          <View
            style={
              styles.menu
            }
          >
            <MenuRow
              title="Profile"
              description="View your customer account details."
              onPress={() =>
                router.navigate(
                  '/profile',
                )
              }
            />

            <MenuRow
              title="Order history"
              description="View purchases and order activity."
              onPress={() =>
                router.navigate(
                  '/order-history',
                )
              }
            />

            <MenuRow
              title="Your Offers"
              description="Personalized offers from VoLTE Mobile."
              onPress={() =>
                router.navigate(
                  '/offers',
                )
              }
            />

            <MenuRow
              title="Notifications"
              description="Updates about your account and services."
              disabled
            />
          </View>
        </Card>

        <Card>
          <View
            style={
              styles.menu
            }
          >
            <MenuRow
              title="Support"
              description="Get help with your VoLTE Mobile account."
              onPress={() =>
                router.navigate(
                  '/support',
                )
              }
            />

            <MenuRow
              title="Privacy"
              description="Privacy information and account protection."
              disabled
            />

            <MenuRow
              title="About VoLTE Mobile"
              description="Learn more about VoLTE Mobile."
              disabled
            />
          </View>
        </Card>

        <Card>
          <View
            style={
              styles.signOutBlock
            }
          >
            <Text
              style={
                styles.sectionLabel
              }
            >
              ACCOUNT ACCESS
            </Text>

            {signOutError ? (
              <Text
                accessibilityRole="alert"
                style={
                  styles.error
                }
              >
                {signOutError}
              </Text>
            ) : null}

            {signingOut ? (
              <View
                style={
                  styles.signingOut
                }
              >
                <ActivityIndicator
                  size="small"
                />

                <Text
                  style={
                    styles.helper
                  }
                >
                  Signing out…
                </Text>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={
                  handleSignOut
                }
                style={({
                  pressed,
                }) => [
                  styles.signOutButton,
                  pressed &&
                    styles
                      .signOutPressed,
                ]}
              >
                <Text
                  style={
                    styles.signOutText
                  }
                >
                  Sign out
                </Text>
              </Pressable>
            )}
          </View>
        </Card>
      </View>
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    content: {
      gap:
        Spacing.lg,
    },

    menu: {
      marginVertical:
        -Spacing.sm,
    },

    menuRow: {
      minHeight: 74,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      gap:
        Spacing.lg,
      paddingVertical:
        Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border
          .default,
    },

    menuRowPressed: {
      opacity: 0.64,
    },

    menuText: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    menuTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight
          .body,
      fontWeight:
        '700',
    },

    menuDescription: {
      color:
        Colors.text
          .secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    menuTrailing: {
      color:
        Colors.brand.primary,
      fontSize: 24,
      lineHeight: 28,
      fontWeight:
        '500',
    },

    menuTrailingMuted: {
      color:
        Colors.text
          .secondary,
      fontSize:
        Typography.size
          .caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      fontWeight:
        '700',
    },

    signOutBlock: {
      gap:
        Spacing.md,
    },

    sectionLabel: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size
          .caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      fontWeight:
        '700',
      letterSpacing: 0.8,
    },

    helper: {
      color:
        Colors.text
          .secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    error: {
      color:
        Colors.status.danger,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight:
        '600',
    },

    signingOut: {
      minHeight: 48,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap:
        Spacing.md,
    },

    signOutButton: {
      minHeight: 48,
      borderRadius:
        Radius.md,
      borderWidth: 1,
      borderColor:
        Colors.border
          .strong,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        Colors.background
          .surface,
    },

    signOutPressed: {
      backgroundColor:
        Colors.background
          .subtle,
    },

    signOutText: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight
          .body,
      fontWeight:
        '700',
    },
  });
