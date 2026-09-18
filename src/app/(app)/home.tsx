import {
  useRouter,
} from 'expo-router';
import {
  useEffect,
  useMemo,
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
  ShellScreen,
} from '@/components/shell/shell-screen';
import {
  getCustomerOrders,
  type CustomerOrder,
} from '@/lib/customer/customer-orders';
import {
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';
import {
  Colors,
  Spacing,
} from '@/theme/tokens';

function customerFirstName(
  fullName: string | null,
) {
  const normalized =
    fullName?.trim() || '';

  if (!normalized) {
    return 'there';
  }

  return (
    normalized
      .split(/\s+/)[0] ||
    'there'
  );
}

function formatJmd(
  value: number,
) {
  const whole =
    Math.round(value);

  return `J$${whole.toLocaleString(
    'en-US',
  )}`;
}

function formatOrderDate(
  value: string | null,
) {
  if (!value) {
    return '';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  return date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  );
}

function QuickAction({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        pressed
          ? styles.actionPressed
          : null,
      ]}
    >
      <Text
        style={styles.actionTitle}
      >
        {title}
      </Text>

      <Text
        style={
          styles.actionDescription
        }
      >
        {description}
      </Text>

      <Text
        style={styles.actionArrow}
      >
        View →
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router =
    useRouter();

  const {
    customer,
  } =
    useCustomerSession();

  const [
    orders,
    setOrders,
  ] =
    useState<CustomerOrder[]>([]);

  const [
    ordersLoading,
    setOrdersLoading,
  ] =
    useState(true);

  const [
    ordersError,
    setOrdersError,
  ] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const result =
          await getCustomerOrders();

        if (!active) {
          return;
        }

        setOrders(result);
        setOrdersError(false);
      } catch {
        if (!active) {
          return;
        }

        setOrders([]);
        setOrdersError(true);
      } finally {
        if (active) {
          setOrdersLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      active = false;
    };
  }, []);

  const firstName =
    useMemo(
      () =>
        customerFirstName(
          customer?.full_name ||
            null,
        ),
      [customer?.full_name],
    );

  const recentOrder =
    orders[0] || null;

  const recentItem =
    recentOrder?.items[0] ||
    null;

  return (
    <ShellScreen
      eyebrow="VoLTE Mobile"
      title={`Hi, ${firstName}`}
      description="Everything connected to your customer account, in one place."
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <Text
            style={styles.sectionLabel}
          >
            MY ACCOUNT
          </Text>

          <Text style={styles.cardTitle}>
            {customer?.full_name ||
              'Customer account'}
          </Text>

          {customer?.email ? (
            <Text
              style={styles.cardMeta}
            >
              {customer.email}
            </Text>
          ) : null}

          {customer?.phone ? (
            <Text
              style={styles.cardMeta}
            >
              {customer.phone}
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text
            style={styles.sectionLabel}
          >
            RECENT ONLINE ORDER
          </Text>

          {ordersLoading ? (
            <View
              style={
                styles.loadingRow
              }
            >
              <ActivityIndicator
                size="small"
              />

              <Text
                style={
                  styles.cardMeta
                }
              >
                Loading your latest
                order…
              </Text>
            </View>
          ) : ordersError ? (
            <Text
              style={styles.cardMeta}
            >
              Your recent online
              order is temporarily
              unavailable.
            </Text>
          ) : recentOrder ? (
            <>
              <Text
                style={styles.cardTitle}
              >
                {recentItem?.name ||
                  'VoLTE Mobile order'}
              </Text>

              <Text
                style={styles.cardMeta}
              >
                {[
                  recentOrder.receiptNumber,
                  formatOrderDate(
                    recentOrder.createdAt,
                  ),
                ]
                  .filter(Boolean)
                  .join(' • ')}
              </Text>

              <View
                style={
                  styles.orderSummary
                }
              >
                <Text
                  style={
                    styles.orderAmount
                  }
                >
                  {formatJmd(
                    recentOrder.total,
                  )}
                </Text>

                <Text
                  style={[
                    styles.orderState,
                    recentOrder.paid
                      ? styles.orderStatePaid
                      : null,
                  ]}
                >
                  {recentOrder.paid
                    ? 'Paid'
                    : recentOrder.orderStatus ||
                      'Order recorded'}
                </Text>
              </View>
            </>
          ) : (
            <Text
              style={styles.cardMeta}
            >
              No online orders yet.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text
            style={styles.sectionLabel}
          >
            YOUR ACCOUNT
          </Text>

          <View
            style={
              styles.actionGrid
            }
          >
            <QuickAction
              title="My Devices"
              description="View device information for your account."
              onPress={() =>
                router.navigate(
                  '/devices',
                )
              }
            />

            <QuickAction
              title="Finance"
              description="Finance and payment information."
              onPress={() =>
                router.navigate(
                  '/finance',
                )
              }
            />

            <QuickAction
              title="Support"
              description="Help with your VoLTE Mobile account."
              onPress={() =>
                router.navigate(
                  '/support',
                )
              }
            />

            <QuickAction
              title="Profile"
              description="Your customer account details."
              onPress={() =>
                router.navigate(
                  '/profile',
                )
              }
            />
          </View>
        </View>
      </View>
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    content: {
      gap: Spacing.xl,
    },

    card: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E3E5EE',
      borderWidth: 1,
      borderRadius: 20,
      padding: Spacing.xl,
      gap: Spacing.md,
    },

    section: {
      gap: Spacing.md,
    },

    sectionLabel: {
      color:
        Colors.brand.secondary,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '800',
      letterSpacing: 1,
    },

    cardTitle: {
      color:
        Colors.text.primary,
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '700',
    },

    cardMeta: {
      color:
        Colors.text.secondary,
      fontSize: 14,
      lineHeight: 21,
    },

    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },

    orderSummary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      gap: Spacing.md,
      marginTop: 2,
    },

    orderAmount: {
      color:
        Colors.text.primary,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '800',
    },

    orderState: {
      color:
        Colors.text.secondary,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '700',
    },

    orderStatePaid: {
      color: '#16854B',
    },

    actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },

    action: {
      flexGrow: 1,
      flexBasis: '46%',
      minHeight: 142,
      backgroundColor:
        '#FFFFFF',
      borderColor: '#E3E5EE',
      borderWidth: 1,
      borderRadius: 18,
      padding: Spacing.xl,
      gap: Spacing.md,
    },

    actionPressed: {
      opacity: 0.72,
    },

    actionTitle: {
      color:
        Colors.text.primary,
      fontSize: 16,
      lineHeight: 21,
      fontWeight: '800',
    },

    actionDescription: {
      color:
        Colors.text.secondary,
      fontSize: 13,
      lineHeight: 19,
      flexGrow: 1,
    },

    actionArrow: {
      color:
        Colors.brand.secondary,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '800',
    },
  });
