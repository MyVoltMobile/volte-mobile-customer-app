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
  Image,
  Linking,
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
  Card,
} from '@/components/ui/card';

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

const HEADER_BLACK =
  '#05070C';

function getFirstName(
  value: string | null,
) {
  const clean =
    String(
      value || '',
    ).trim();

  return (
    clean.split(/\s+/)[0] ||
    'there'
  );
}

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
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
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

function SearchIcon() {
  return (
    <View
      style={
        styles.searchIcon
      }
    >
      <View
        style={
          styles.searchLens
        }
      />

      <View
        style={
          styles.searchHandle
        }
      />
    </View>
  );
}

function FixedHeader({
  onSearch,
}: {
  onSearch: () => void;
}) {
  return (
    <SafeAreaView
      edges={[
        'top',
      ]}
      style={
        styles.headerSafe
      }
    >
      <View
        style={
          styles.header
        }
      >
        <Image
          source={require(
            '../../../assets/brand/volte-mobile-icon.png'
          )}
          resizeMode="contain"
          accessibilityLabel="VoLTE Mobile"
          style={
            styles.logo
          }
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search VoLTE Mobile"
          hitSlop={8}
          onPress={
            onSearch
          }
          style={({
            pressed,
          }) => [
            styles.searchButton,
            pressed &&
              styles.searchPressed,
          ]}
        >
          <SearchIcon />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function RecentOrder({
  orders,
  loading,
  failed,
  onViewAll,
}: {
  orders: CustomerOrder[];
  loading: boolean;
  failed: boolean;
  onViewAll: () => void;
}) {
  const order =
    orders[0] || null;

  const item =
    order?.items[0] ||
    null;

  return (
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
        <View
          style={
            styles.sectionHeading
          }
        >
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

        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={
            onViewAll
          }
        >
          <Text
            style={
              styles.sectionAction
            }
          >
            View all
          </Text>
        </Pressable>
      </View>

      <Card>
        {loading ? (
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
              Loading your latest order…
            </Text>
          </View>
        ) : failed ? (
          <Text
            style={
              styles.bodyText
            }
          >
            Your recent online order is
            temporarily unavailable.
          </Text>
        ) : order ? (
          <View
            style={
              styles.orderContent
            }
          >
            <View
              style={
                styles.orderTop
              }
            >
              <View
                style={
                  styles.orderHeading
                }
              >
                <Text
                  style={
                    styles.orderTitle
                  }
                >
                  {
                    item?.name ||
                    'VoLTE Mobile order'
                  }
                </Text>

                <Text
                  style={
                    styles.bodyText
                  }
                >
                  {[
                    order.receiptNumber,
                    formatDate(
                      order.createdAt,
                    ),
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                </Text>
              </View>

              <Text
                style={
                  order.paid
                    ? styles.paidStatus
                    : styles.orderStatus
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

            <View
              style={
                styles.orderBottom
              }
            >
              <Text
                style={
                  styles.orderAmount
                }
              >
                {
                  formatMoney(
                    order.total,
                  )
                }
              </Text>

              <Text
                style={
                  styles.orderHint
                }
              >
                Online purchase
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={
              styles.emptyOrder
            }
          >
            <Text
              style={
                styles.orderTitle
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
              purchases will appear here.
            </Text>
          </View>
        )}
      </Card>
    </View>
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
    useState<
      CustomerOrder[]
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

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result =
          await getCustomerOrders();

        if (!active) {
          return;
        }

        setOrders(result);
        setFailed(false);
      } catch {
        if (!active) {
          return;
        }

        setOrders([]);
        setFailed(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const name =
    useMemo(
      () =>
        getFirstName(
          customer?.full_name ||
            null,
        ),
      [customer?.full_name],
    );

  return (
    <View
      style={
        styles.screen
      }
    >
      <FixedHeader
        onSearch={() =>
          router.navigate(
            '/search',
          )
        }
      />

      <ScrollView
        style={
          styles.scroll
        }
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={
            styles.hero
          }
        >
          <Text
            style={
              styles.greeting
            }
          >
            Hi, {name}
          </Text>

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
                  .catch(() => {});
              }}
              style={({
                pressed,
              }) => [
                styles.shopButton,
                pressed &&
                  styles.shopPressed,
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

        <View
          style={
            styles.content
          }
        >
          <RecentOrder
            orders={orders}
            loading={loading}
            failed={failed}
            onViewAll={() =>
              router.navigate(
                '/order-history',
              )
            }
          />

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.navigate(
                '/offers',
              )
            }
            style={({
              pressed,
            }) => [
              styles.offerCard,
              pressed &&
                styles.offerPressed,
            ]}
          >
            <View
              style={
                styles.offerText
              }
            >
              <Text
                style={
                  styles.offerEyebrow
                }
              >
                YOUR OFFERS
              </Text>

              <Text
                style={
                  styles.offerTitle
                }
              >
                Something for you.
              </Text>

              <Text
                style={
                  styles.offerDescription
                }
              >
                Personalized VoLTE Mobile
                offers will appear here.
              </Text>
            </View>

            <Text
              style={
                styles.offerArrow
              }
            >
              ›
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        Colors.background.app,
    },

    headerSafe: {
      backgroundColor:
        HEADER_BLACK,
    },

    header: {
      minHeight: 76,
      paddingHorizontal:
        Spacing.xl,
      backgroundColor:
        HEADER_BLACK,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
    },

    logo: {
      width: 43,
      height: 48,
    },

    searchButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        Colors.background.surface,
      borderWidth: 1,
      borderColor:
        '#252A33',
    },

    searchPressed: {
      opacity: 0.82,
    },

    searchIcon: {
      width: 26,
      height: 26,
      position:
        'relative',
    },

    searchLens: {
      position:
        'absolute',
      left: 2,
      top: 1,
      width: 17,
      height: 17,
      borderRadius: 9,
      borderWidth: 2.5,
      borderColor:
        HEADER_BLACK,
    },

    searchHandle: {
      position:
        'absolute',
      right: 1,
      bottom: 4,
      width: 11,
      height: 2.5,
      borderRadius: 2,
      backgroundColor:
        HEADER_BLACK,
      transform: [
        {
          rotate: '45deg',
        },
      ],
    },

    scroll: {
      flex: 1,
      backgroundColor:
        Colors.background.app,
    },

    scrollContent: {
      paddingBottom:
        Spacing.xxxl,
    },

    hero: {
      width: '100%',
      paddingHorizontal:
        Spacing.xl,
      paddingTop:
        Spacing.md,
      paddingBottom: 30,
      gap:
        Spacing.xl,
      backgroundColor:
        HEADER_BLACK,
    },

    greeting: {
      color:
        Colors.text.inverse,
      fontSize:
        Typography.size.display,
      lineHeight:
        Typography.lineHeight.display,
      fontWeight:
        '700',
      letterSpacing:
        -0.8,
    },

    shopCard: {
      width: '100%',
      padding:
        Spacing.xl,
      gap:
        Spacing.lg,
      borderRadius:
        Radius.xl,
      backgroundColor:
        Colors.brand.secondary,
    },

    shopEyebrow: {
      color:
        Colors.text.inverse,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
      letterSpacing: 1,
    },

    shopTitle: {
      color:
        Colors.text.inverse,
      fontSize:
        Typography.size.title,
      lineHeight:
        Typography.lineHeight.title,
      fontWeight:
        '700',
    },

    shopDescription: {
      color:
        '#FBE7F1',
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight.body,
    },

    shopButton: {
      minHeight: 54,
      marginTop:
        Spacing.xs,
      paddingHorizontal:
        Spacing.lg,
      borderRadius:
        Radius.md,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        Colors.background.surface,
    },

    shopPressed: {
      opacity: 0.86,
    },

    shopButtonText: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
    },

    content: {
      paddingHorizontal:
        Spacing.xl,
      paddingTop:
        Spacing.xl,
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

    sectionHeading: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    sectionLabel: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
      letterSpacing: 1,
    },

    sectionTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.titleSmall,
      fontWeight:
        '700',
    },

    sectionAction: {
      color:
        Colors.brand.primary,
      fontSize:
        Typography.size.bodySmall,
      fontWeight:
        '700',
    },

    loadingRow: {
      flexDirection:
        'row',
      alignItems:
        'center',
      gap:
        Spacing.md,
    },

    orderContent: {
      gap:
        Spacing.lg,
    },

    orderTop: {
      flexDirection:
        'row',
      alignItems:
        'flex-start',
      justifyContent:
        'space-between',
      gap:
        Spacing.md,
    },

    orderHeading: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    orderTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
    },

    bodyText: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight.bodySmall,
    },

    paidStatus: {
      color:
        Colors.status.success,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
    },

    orderStatus: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
    },

    orderBottom: {
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
      fontSize:
        Typography.size.titleSmall,
      fontWeight:
        '700',
    },

    orderHint: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.caption,
    },

    emptyOrder: {
      gap:
        Spacing.sm,
    },

    offerCard: {
      minHeight: 128,
      padding:
        Spacing.lg,
      borderWidth: 1,
      borderColor:
        Colors.border.default,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.background.surface,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      gap:
        Spacing.md,
    },

    offerPressed: {
      backgroundColor:
        Colors.background.subtle,
    },

    offerText: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    offerEyebrow: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
      letterSpacing: 1,
    },

    offerTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.titleSmall,
      fontWeight:
        '700',
    },

    offerDescription: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight.bodySmall,
    },

    offerArrow: {
      color:
        Colors.brand.primary,
      fontSize: 34,
      fontWeight:
        '400',
    },
  });
