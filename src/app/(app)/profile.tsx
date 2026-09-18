import {
  useState,
} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Button,
} from '@/components/ui/button';
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
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';
import {
  Colors,
  Spacing,
  Typography,
} from '@/theme/tokens';

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const {
    customer,
  } =
    useCustomerSession();

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

      /*
       * CustomerSessionProvider already listens
       * for SIGNED_OUT and clears customer state.
       * Protected app routing then returns the
       * customer to the signed-out experience.
       */
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
      title="Profile"
      description="Your VoLTE Mobile customer account information."
    >
      <View style={styles.content}>
        <Card>
          <View style={styles.cardContent}>
            <Text
              style={styles.sectionLabel}
            >
              PERSONAL DETAILS
            </Text>

            <ProfileRow
              label="Name"
              value={
                customer?.full_name
                  ?.trim() ||
                'Not provided'
              }
            />

            <ProfileRow
              label="Email"
              value={
                customer?.email
                  ?.trim() ||
                'Not provided'
              }
            />

            <ProfileRow
              label="Phone"
              value={
                customer?.phone
                  ?.trim() ||
                'Not provided'
              }
            />

            <ProfileRow
              label="Address"
              value={
                customer?.address
                  ?.trim() ||
                'Not provided'
              }
            />
          </View>
        </Card>

        <Card>
          <View style={styles.cardContent}>
            <Text
              style={styles.sectionLabel}
            >
              ACCOUNT ACCESS
            </Text>

            <Text style={styles.helper}>
              Signing out removes the active
              customer session from this device.
              You can sign in again using your
              registered email address.
            </Text>

            {signOutError ? (
              <Text
                accessibilityRole="alert"
                style={styles.error}
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
                  style={styles.helper}
                >
                  Signing out…
                </Text>
              </View>
            ) : (
              <Button
                label="Sign out"
                variant="secondary"
                onPress={
                  handleSignOut
                }
              />
            )}
          </View>
        </Card>

        <Text style={styles.readOnly}>
          Profile information is currently
          read-only in the VoLTE Mobile app.
        </Text>
      </View>
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    content: {
      gap: Spacing.lg,
    },

    cardContent: {
      gap: Spacing.lg,
    },

    sectionLabel: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      fontWeight: '800',
      letterSpacing: 0.8,
    },

    row: {
      gap: Spacing.xs,
    },

    label: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight: '600',
    },

    value: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight.body,
      fontWeight: '600',
    },

    helper: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    signingOut: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.md,
    },

    error: {
      color:
        Colors.status.danger,
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight: '600',
    },

    readOnly: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      textAlign: 'center',
      paddingHorizontal:
        Spacing.lg,
    },
  });
