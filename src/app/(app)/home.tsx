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
  Linking,
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
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

const SHOP_URL =
  'https://voltemobile.com/shop';

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

function ServiceTile({
  eyebrow,
  title,
  description,
  onPress,
}: {
  eyebrow: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({
        pressed,
      }) => [
        styles.serviceTile,
        pressed &&
          styles.tilePressed,
      ]}
    >
      <Text
        style={
          styles.tileEyebrow
        }
      >
        {eyebrow}
      </Text>

      <Text
        style={
          styles.tileTitle
        }
      >
        {title}
      </Text>

      <Text
        style={
          styles.tileDescription
        }
      >
        {description}
      </Text>

      <Text
        style={
          styles.tileAction
        }
      >
        View →
      </Text>
    </Pressable>
  );
}

function UtilityTile({
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
      style={({
        pressed,
      }) => [
        styles.utilityTile,
        pressed &&
          styles.tilePressed,
      ]}
    >
      <Text
        style={
          styles.utilityTitle
        }
      >
        {title}
      </Text>

      <Text
        style={
          styles.utilityDescription
        }
      >
        {description}
      </Text>

      <Text
        style={
          styles.utilityAction
        }
      >
        Open →
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
    useState<CustomerOrder[]>(
      [],
    );

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
      description="Your account, services and support in one place."
    >
      <View
        style={
          styles.content
        }
      >
        <Card>
          <View
            style={
              styles.accountCard
            }
          >
            <View
              style={
                styles.accountHeader
              }
            >
              <View
                style={
                  styles.accountTitleBlock
                }
              >
                <Text
                  style={
                    styles.sectionLabel
                  }
                >
                  MY ACCOUNT
                </Text>

                <Text
                  style={
                    styles.accountName
                  }
                >
                  {
                    customer
                      ?.full_name ||
                    'Customer account'
                  }
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  router.navigate(
                    '/profile',
                  )
                }
                style={({
                  pressed,
                }) => [
                  styles.profileButton,
                  pressed &&
                    styles.tilePressed,
                ]}
              >
                <Text
                  style={
                    styles.profileButtonText
                  }
                >
                  Profile
                </Text>
              </Pressable>
            </View>

            <View
              style={
                styles.accountDetails
              }
            >
              {customer?.email ? (
                <Text
                  style={
                    styles.accountMeta
                  }
                >
                  {customer.email}
                </Text>
              ) : null}

              {customer?.phone ? (
                <Text
                  style={
                    styles.accountMeta
                  }
                >
                  {customer.phone}
                </Text>
              ) : null}
            </View>
          </View>
        </Card>


        <View
          style={
            styles.section
          }
        >
          <View
            style={
              styles.sectionHeader
            }
          >
            <View>
              <Text
                style={
                  styles.sectionLabel
                }
              >
                YOUR SERVICES
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Everything connected
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.navigate(
                  '/services',
                )
              }
            >
              <Text
                style={
                  styles.sectionLink
                }
              >
                See all
              </Text>
            </Pressable>
          </View>

          <View
            style={
              styles.serviceGrid
            }
          >
            <ServiceTile
              eyebrow="DEVICE"
              title="My Devices"
              description="Phones linked to your account."
              onPress={() =>
                router.navigate(
                  '/devices',
                )
              }
            />

            <ServiceTile
              eyebrow="MOBILE"
              title="My eSIM"
              description="Plans and installation."
              onPress={() =>
                router.navigate(
                  '/esim',
                )
              }
            />

            <ServiceTile
              eyebrow="ENTERTAINMENT"
              title="My IPTV"
              description="Package and service access."
              onPress={() =>
                router.navigate(
                  '/iptv',
                )
              }
            />
          </View>
        </View>


        <View
          style={
            styles.section
          }
        >
          <View>
            <Text
              style={
                styles.sectionLabel
              }
            >
              RECENT ACTIVITY
            </Text>

            <Text
              style={
                styles.sectionTitle
              }
            >
              Latest online order
            </Text>
          </View>

          <Card>
            <View
              style={
                styles.activityCard
              }
            >
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
                      styles.bodyText
                    }
                  >
                    Loading your latest
                    order…
                  </Text>
                </View>
              ) : ordersError ? (
                <Text
                  style={
                    styles.bodyText
                  }
                >
                  Your recent online
                  order is temporarily
                  unavailable.
                </Text>
              ) : recentOrder ? (
                <>
                  <View
                    style={
                      styles.activityTop
                    }
                  >
                    <View
                      style={
                        styles.activityTitleBlock
                      }
                    >
                      <Text
                        style={
                          styles.activityTitle
                        }
                      >
                        {
                          recentItem
                            ?.name ||
                          'VoLTE Mobile order'
                        }
                      </Text>

                      <Text
                        style={
                          styles.bodyText
                        }
                      >
                        {[
                          recentOrder
                            .receiptNumber,

                          formatOrderDate(
                            recentOrder
                              .createdAt,
                          ),
                        ]
                          .filter(Boolean)
                          .join(' • ')}
                      </Text>
                    </View>

                    <Text
                      style={
                        recentOrder.paid
                          ? styles
                              .paidStatus
                          : styles
                              .orderStatus
                      }
                    >
                      {
                        recentOrder.paid
                          ? 'Paid'
                          : recentOrder
                              .orderStatus ||
                            'Recorded'
                      }
                    </Text>
                  </View>

                  <View
                    style={
                      styles.activityBottom
                    }
                  >
                    <Text
                      style={
                        styles.orderAmount
                      }
                    >
                      {
                        formatJmd(
                          recentOrder.total,
                        )
                      }
                    </Text>

                    <Text
                      style={
                        styles.activityHint
                      }
                    >
                      Online purchase
                    </Text>
                  </View>
                </>
              ) : (
                <View
                  style={
                    styles.emptyActivity
                  }
                >
                  <Text
                    style={
                      styles.activityTitle
                    }
                  >
                    No online orders yet
                  </Text>

                  <Text
                    style={
                      styles.bodyText
                    }
                  >
                    Your latest online
                    purchases will appear
                    here.
                  </Text>
                </View>
              )}
            </View>
          </Card>
        </View>


        <View
          style={
            styles.section
          }
        >
          <Text
            style={
              styles.sectionLabel
            }
          >
            ACCOUNT TOOLS
          </Text>

          <View
            style={
              styles.utilityGrid
            }
          >
            <UtilityTile
              title="Finance"
              description="Finance and payment information."
              onPress={() =>
                router.navigate(
                  '/finance',
                )
              }
            />

            <UtilityTile
              title="Support"
              description="Get help with your account and services."
              onPress={() =>
                router.navigate(
                  '/support',
                )
              }
            />
          </View>
        </View>


        <View
          style={
            styles.shopCard
          }
        >
          <Text
            style={
              styles.shopEyebrow
            }
          >
            POWERING EVERY CONNECTION!
          </Text>

          <Text
            style={
              styles.shopTitle
            }
          >
            Explore what's next.
          </Text>

          <Text
            style={
              styles.shopDescription
            }
          >
            Discover devices,
            accessories and services
            from VoLTE Mobile.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void Linking
                .openURL(
                  SHOP_URL,
                )
                .catch(() => {
                  /*
                   * Browser launch failure
                   * leaves the customer
                   * safely inside the app.
                   */
                });
            }}
            style={({
              pressed,
            }) => [
              styles.shopButton,
              pressed &&
                styles
                  .shopButtonPressed,
            ]}
          >
            <Text
              style={
                styles.shopButtonText
              }
            >
              Shop VoLTE Mobile
            </Text>
          </Pressable>
        </View>
      </View>
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    content: {
      gap:
        Spacing.xl,
    },

    section: {
      gap:
        Spacing.md,
    },

    sectionHeader: {
      flexDirection:
        'row',
      alignItems:
        'flex-end',
      justifyContent:
        'space-between',
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
        '800',
      letterSpacing: 0.9,
    },

    sectionTitle: {
      marginTop:
        Spacing.xs,
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .titleSmall,
      lineHeight:
        Typography.lineHeight
          .titleSmall,
      fontWeight:
        '800',
    },

    sectionLink: {
      color:
        Colors.brand.primary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight:
        '800',
    },

    accountCard: {
      gap:
        Spacing.lg,
    },

    accountHeader: {
      flexDirection:
        'row',
      alignItems:
        'flex-start',
      justifyContent:
        'space-between',
      gap:
        Spacing.md,
    },

    accountTitleBlock: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    accountName: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .titleSmall,
      lineHeight:
        Typography.lineHeight
          .titleSmall,
      fontWeight:
        '800',
    },

    accountDetails: {
      gap:
        Spacing.xs,
    },

    accountMeta: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    profileButton: {
      minHeight: 38,
      paddingHorizontal:
        Spacing.md,
      alignItems:
        'center',
      justifyContent:
        'center',
      borderRadius:
        Radius.pill,
      borderWidth: 1,
      borderColor:
        Colors.border.default,
      backgroundColor:
        Colors.background
          .subtle,
    },

    profileButtonText: {
      color:
        Colors.brand.primary,
      fontSize:
        Typography.size
          .caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      fontWeight:
        '800',
    },

    serviceGrid: {
      flexDirection:
        'row',
      flexWrap:
        'wrap',
      gap:
        Spacing.md,
    },

    serviceTile: {
      flexGrow: 1,
      flexBasis: '46%',
      minHeight: 156,
      padding:
        Spacing.lg,
      borderRadius:
        Radius.lg,
      borderWidth: 1,
      borderColor:
        Colors.border.default,
      backgroundColor:
        Colors.background
          .surface,
      gap:
        Spacing.sm,
    },

    tilePressed: {
      opacity: 0.66,
    },

    tileEyebrow: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size
          .caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      fontWeight:
        '800',
      letterSpacing: 0.7,
    },

    tileTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight
          .body,
      fontWeight:
        '800',
    },

    tileDescription: {
      flexGrow: 1,
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    tileAction: {
      color:
        Colors.brand.primary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight:
        '800',
    },

    activityCard: {
      gap:
        Spacing.lg,
    },

    loadingRow: {
      flexDirection:
        'row',
      alignItems:
        'center',
      gap:
        Spacing.md,
    },

    activityTop: {
      flexDirection:
        'row',
      alignItems:
        'flex-start',
      justifyContent:
        'space-between',
      gap:
        Spacing.md,
    },

    activityTitleBlock: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    activityTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight
          .body,
      fontWeight:
        '800',
    },

    bodyText: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    paidStatus: {
      color:
        Colors.status.success,
      fontSize:
        Typography.size
          .caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      fontWeight:
        '800',
    },

    orderStatus: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      fontWeight:
        '800',
    },

    activityBottom: {
      paddingTop:
        Spacing.md,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border.default,
      flexDirection:
        'row',
      alignItems:
        'flex-end',
      justifyContent:
        'space-between',
      gap:
        Spacing.md,
    },

    orderAmount: {
      color:
        Colors.text.primary,
      fontSize: 20,
      lineHeight: 26,
      fontWeight:
        '800',
    },

    activityHint: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      fontWeight:
        '600',
    },

    emptyActivity: {
      gap:
        Spacing.xs,
    },

    utilityGrid: {
      flexDirection:
        'row',
      gap:
        Spacing.md,
    },

    utilityTile: {
      flex: 1,
      minHeight: 138,
      padding:
        Spacing.lg,
      borderRadius:
        Radius.lg,
      borderWidth: 1,
      borderColor:
        Colors.border.default,
      backgroundColor:
        Colors.background
          .surface,
      gap:
        Spacing.sm,
    },

    utilityTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight
          .body,
      fontWeight:
        '800',
    },

    utilityDescription: {
      flexGrow: 1,
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    utilityAction: {
      color:
        Colors.brand.primary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight:
        '800',
    },

    shopCard: {
      padding:
        Spacing.xl,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.brand.primary,
      gap:
        Spacing.md,
    },

    shopEyebrow: {
      color:
        Colors.text.inverse,
      opacity: 0.82,
      fontSize:
        Typography.size
          .caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      fontWeight:
        '800',
      letterSpacing: 0.8,
    },

    shopTitle: {
      color:
        Colors.text.inverse,
      fontSize: 24,
      lineHeight: 30,
      fontWeight:
        '800',
    },

    shopDescription: {
      color:
        Colors.text.inverse,
      opacity: 0.86,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight
          .body,
    },

    shopButton: {
      minHeight: 50,
      marginTop:
        Spacing.xs,
      borderRadius:
        Radius.md,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        Colors.background
          .surface,
    },

    shopButtonPressed: {
      opacity: 0.84,
    },

    shopButtonText: {
      color:
        Colors.brand.primary,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight
          .body,
      fontWeight:
        '800',
    },
  });
