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
  getCustomerOrders,
  type CustomerOrder,
} from '@/lib/customer/customer-orders';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

type LoadState =
  | 'loading'
  | 'ready'
  | 'error';

function formatMoney(
  value: number,
) {
  return `J$${Math.round(
    value,
  ).toLocaleString(
    'en-US',
  )}`;
}

function formatDate(
  value: string | null,
) {
  if (!value) {
    return 'Date unavailable';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );
}

function OrderCard({
  order,
}: {
  order: CustomerOrder;
}) {
  return (
    <Card>
      <View
        style={
          styles.content
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
                styles.receipt
              }
            >
              {
                order.receiptNumber ||
                'Online order'
              }
            </Text>

            <Text
              style={
                styles.meta
              }
            >
              {
                formatDate(
                  order.createdAt,
                )
              }
            </Text>
          </View>

          <Text
            style={
              order.paid
                ? styles.paid
                : styles.status
            }
          >
            {
              order.paid
                ? 'Paid'
                : order.orderStatus ||
                  'Recorded'
            }
          </Text>
        </View>

        {order.items.length > 0 ? (
          <View
            style={
              styles.items
            }
          >
            {order.items.map(
              (item) => (
                <View
                  key={
                    item.id
                  }
                  style={
                    styles.itemRow
                  }
                >
                  <View
                    style={
                      styles.itemText
                    }
                  >
                    <Text
                      style={
                        styles.itemName
                      }
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={
                        styles.meta
                      }
                    >
                      Qty {item.quantity}
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.itemAmount
                    }
                  >
                    {
                      formatMoney(
                        item.lineTotal,
                      )
                    }
                  </Text>
                </View>
              ),
            )}
          </View>
        ) : null}

        <View
          style={
            styles.totalRow
          }
        >
          <Text
            style={
              styles.totalLabel
            }
          >
            Total
          </Text>

          <Text
            style={
              styles.total
            }
          >
            {
              formatMoney(
                order.total,
              )
            }
          </Text>
        </View>
      </View>
    </Card>
  );
}

export default function OrderHistoryScreen() {
  const [
    orders,
    setOrders,
  ] =
    useState<
      CustomerOrder[]
    >([]);

  const [
    state,
    setState,
  ] =
    useState<LoadState>(
      'loading',
    );

  const load =
    useCallback(
      async () => {
        setState(
          'loading',
        );

        try {
          const result =
            await getCustomerOrders();

          setOrders(
            result,
          );

          setState(
            'ready',
          );
        } catch {
          setOrders([]);

          setState(
            'error',
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
      eyebrow="Account"
      title="Order History"
      description="Your VoLTE Mobile online purchases."
    >
      {state ===
      'loading' ? (
        <Card>
          <View
            style={
              styles.state
            }
          >
            <ActivityIndicator />

            <Text
              style={
                styles.stateTitle
              }
            >
              Loading your orders
            </Text>
          </View>
        </Card>
      ) : null}

      {state ===
      'error' ? (
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
              Order history unavailable
            </Text>

            <Text
              style={
                styles.stateText
              }
            >
              We could not load your
              purchases right now.
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

      {state ===
        'ready' &&
      orders.length === 0 ? (
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
              No online orders yet
            </Text>

            <Text
              style={
                styles.stateText
              }
            >
              Your online VoLTE Mobile
              purchases will appear here.
            </Text>
          </View>
        </Card>
      ) : null}

      {state ===
        'ready' &&
      orders.length > 0 ? (
        <View
          style={
            styles.list
          }
        >
          {orders.map(
            (order) => (
              <OrderCard
                key={
                  order.id
                }
                order={
                  order
                }
              />
            ),
          )}
        </View>
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

    content: {
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

    receipt: {
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

    meta: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    paid: {
      color:
        Colors.status.success,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
    },

    status: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
    },

    items: {
      borderTopWidth: 1,
      borderTopColor:
        Colors.border.default,
    },

    itemRow: {
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

    itemText: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    itemName: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight:
        '600',
    },

    itemAmount: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .bodySmall,
      fontWeight:
        '600',
    },

    totalRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
    },

    totalLabel: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.body,
    },

    total: {
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

    stateText: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
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
      fontSize:
        Typography.size
          .bodySmall,
      fontWeight:
        '700',
    },
  });
