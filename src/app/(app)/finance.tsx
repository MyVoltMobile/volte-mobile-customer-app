import {
  useCallback,
  useEffect,
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
  getCustomerFinanceAccounts,
  type CustomerFinanceAccount,
} from '@/lib/customer/customer-finance';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

function money(
  value: number,
) {
  return `J$${Math.round(
    value,
  ).toLocaleString(
    'en-US',
  )}`;
}

function FinanceCard({
  account,
}: {
  account:
    CustomerFinanceAccount;
}) {
  return (
    <Card>
      <View
        style={
          styles.account
        }
      >
        <View
          style={
            styles.header
          }
        >
          <View
            style={
              styles.heading
            }
          >
            <Text
              style={
                styles.device
              }
            >
              {account.deviceName}
            </Text>

            <Text
              style={
                styles.helper
              }
            >
              Device finance
            </Text>
          </View>

          <Text
            style={
              styles.status
            }
          >
            {account.status}
          </Text>
        </View>

        <View
          style={
            styles.balanceBlock
          }
        >
          <Text
            style={
              styles.helper
            }
          >
            Outstanding balance
          </Text>

          <Text
            style={
              styles.balance
            }
          >
            {
              money(
                account
                  .balanceRemaining,
              )
            }
          </Text>
        </View>

        <View
          style={
            styles.details
          }
        >
          <View
            style={
              styles.row
            }
          >
            <Text
              style={
                styles.rowLabel
              }
            >
              Monthly payment
            </Text>

            <Text
              style={
                styles.rowValue
              }
            >
              {
                money(
                  account
                    .monthlyPayment,
                )
              }
            </Text>
          </View>

          <View
            style={
              styles.row
            }
          >
            <Text
              style={
                styles.rowLabel
              }
            >
              Original amount
            </Text>

            <Text
              style={
                styles.rowValue
              }
            >
              {
                money(
                  account
                    .totalPrice,
                )
              }
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

export default function FinanceScreen() {
  const [
    accounts,
    setAccounts,
  ] =
    useState<
      CustomerFinanceAccount[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    failed,
    setFailed,
  ] =
    useState(false);

  const load =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setFailed(
          false,
        );

        try {
          const result =
            await getCustomerFinanceAccounts();

          setAccounts(
            result,
          );
        } catch {
          setAccounts([]);
          setFailed(true);
        } finally {
          setLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ShellScreen
      eyebrow="Customer"
      title="Finance"
      description="Your VoLTE Mobile device finance information."
    >
      {loading ? (
        <Card>
          <View
            style={
              styles.loading
            }
          >
            <ActivityIndicator />

            <Text
              style={
                styles.helper
              }
            >
              Loading your finance information…
            </Text>
          </View>
        </Card>
      ) : null}

      {!loading &&
      failed ? (
        <Card>
          <View
            style={
              styles.state
            }
          >
            <Text
              style={
                styles.stateTitle
              }
            >
              Finance information unavailable
            </Text>

            <Text
              style={
                styles.helper
              }
            >
              We could not load
              your finance accounts
              right now.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void load();
              }}
              style={
                styles.retry
              }
            >
              <Text
                style={
                  styles.retryText
                }
              >
                Try again
              </Text>
            </Pressable>
          </View>
        </Card>
      ) : null}

      {!loading &&
      !failed &&
      accounts.length ===
        0 ? (
        <Card>
          <View
            style={
              styles.state
            }
          >
            <Text
              style={
                styles.stateTitle
              }
            >
              No active device finance accounts
            </Text>

            <Text
              style={
                styles.helper
              }
            >
              Active VoLTE Mobile
              device-finance accounts
              will appear here.
            </Text>
          </View>
        </Card>
      ) : null}

      {!loading &&
      !failed &&
      accounts.length > 0 ? (
        <View
          style={
            styles.list
          }
        >
          {accounts.map(
            (account) => (
              <FinanceCard
                key={
                  account.id
                }
                account={
                  account
                }
              />
            ),
          )}
        </View>
      ) : null}

      <Card>
        <View
          style={
            styles.notice
          }
        >
          <Text
            style={
              styles.noticeTitle
            }
          >
            Payments
          </Text>

          <Text
            style={
              styles.helper
            }
          >
            Secure in-app payment
            options will be connected
            through the verified
            VoLTE Mobile payment
            authority.
          </Text>
        </View>
      </Card>
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    list: {
      gap:
        Spacing.md,
    },

    account: {
      gap:
        Spacing.lg,
    },

    header: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'flex-start',
      gap:
        Spacing.md,
    },

    heading: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    device: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .titleSmall,
      lineHeight:
        Typography.lineHeight
          .titleSmall,
      fontWeight:
        '700',
    },

    helper: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    status: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
    },

    balanceBlock: {
      gap:
        Spacing.xs,
    },

    balance: {
      color:
        Colors.text.primary,
      fontSize: 28,
      lineHeight: 34,
      fontWeight:
        '700',
    },

    details: {
      borderTopWidth: 1,
      borderTopColor:
        Colors.border.default,
    },

    row: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      gap:
        Spacing.md,
      paddingVertical:
        Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border.default,
    },

    rowLabel: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
    },

    rowValue: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .bodySmall,
      fontWeight:
        '600',
    },

    loading: {
      flexDirection:
        'row',
      alignItems:
        'center',
      gap:
        Spacing.md,
    },

    state: {
      gap:
        Spacing.sm,
    },

    stateTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
    },

    retry: {
      alignSelf:
        'flex-start',
      marginTop:
        Spacing.sm,
      paddingHorizontal:
        Spacing.lg,
      paddingVertical:
        Spacing.md,
      borderRadius:
        Radius.md,
      backgroundColor:
        Colors.brand.secondary,
    },

    retryText: {
      color:
        Colors.text.inverse,
      fontWeight:
        '700',
    },

    notice: {
      gap:
        Spacing.sm,
    },

    noticeTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
    },
  });
