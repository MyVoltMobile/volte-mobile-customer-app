import {
  useCallback,
  useRef,
  useState,
} from 'react';

import * as WebBrowser from 'expo-web-browser';
import { useFocusEffect } from 'expo-router';

import {
  ActivityIndicator,
  AppState,
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
  startCustomerInstallmentCheckout,
  type CustomerFinanceAccount,
} from '@/lib/customer/customer-finance';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

function money(value: number | null) {
  return value === null
    ? 'Unavailable'
    : `J$${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
}

function paymentDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return 'Unavailable';
  }

  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? 'Unavailable'
    : date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      });
}

function FinanceCard({
  account,
  onPay,
  busy,
}: {
  onPay: () => void;
  busy: boolean;
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

        <View style={styles.details}>
          {[
            ['Original financed amount', money(account.originalFinancedAmount)],
            ['Maturity date', paymentDate(account.maturityDate)],
            ['Payment amount', money(account.monthlyPayment)],
            ['Payment frequency', account.paymentFrequency ?? 'Unavailable'],
            ['Next payment due', paymentDate(account.nextDueDate)],
            ['Term', account.termMonths
              ? `${account.termMonths} ${account.termMonths === 1 ? 'month' : 'months'}`
              : 'Unavailable'],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowValue}>{value}</Text>
            </View>
          ))}
        </View>
        {account.installmentCheckoutEnabled && (
          <Pressable accessibilityRole="button" disabled={busy} onPress={onPay} style={[styles.retry, busy && { opacity: 0.6 }]}>
            <Text style={styles.retryText}>{busy ? "Opening checkout…" : "Pay instalment"}</Text>
          </Pressable>
        )}
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

  const [checkoutError, setCheckoutError] = useState('');
  const [paying, setPaying] = useState(false);
  const openingCheckout = useRef(false);

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

  useFocusEffect(useCallback(() => {
    void load();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void load();
    });
    return () => subscription.remove();
  }, [load]));

  async function pay(accountId: string) {
    if (openingCheckout.current) return;
    openingCheckout.current = true;
    setPaying(true);
    setCheckoutError('');
    try {
      const url = await startCustomerInstallmentCheckout(accountId);
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Secure checkout could not be opened.');
    } finally {
      openingCheckout.current = false;
      setPaying(false);
    }
  }

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
               onPay={() => void pay(account.id)} busy={paying} />
            ),
          )}
        </View>
      ) : null}

      {checkoutError ? <Card><Text accessibilityLiveRegion="polite" style={styles.helper}>{checkoutError}</Text></Card> : null}
      {accounts.length > 0 && !accounts.some((account) => account.installmentCheckoutEnabled) ? (
        <Card><Text style={styles.helper}>In-app instalment payments are currently unavailable.</Text></Card>
      ) : null}
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
      gap: Spacing.xs,
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
