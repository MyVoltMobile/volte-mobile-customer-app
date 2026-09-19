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
  ImageBackground,
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
  getCustomerOrders,
  type CustomerOrder,
} from '@/lib/customer/customer-orders';

import {
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';

const SHOP_URL =
  'https://voltemobile.com/shop';

const BLACK =
  '#05070C';

const APP_BG =
  '#F3F5F8';

const SURFACE =
  '#FFFFFF';

const INK =
  '#11131A';

const MUTED =
  '#687084';

const BORDER =
  '#E0E4EB';

const MAGENTA =
  '#C51B74';

const PURPLE =
  '#5735C5';

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
  name,
  onSearch,
}: {
  name: string;
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
          styles.headerRow
        }
      >
        <Image
          source={require(
            '../../../assets/brand/volte-mobile-icon.png'
          )}
          resizeMode="contain"
          accessibilityLabel="VoLTE Mobile"
          style={
            styles.brandIcon
          }
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search VoLTE Mobile"
          onPress={
            onSearch
          }
          hitSlop={8}
          style={({
            pressed,
          }) => [
            styles.searchButton,
            pressed &&
              styles.pressed,
          ]}
        >
          <SearchIcon />
        </Pressable>
      </View>

      <Text
        numberOfLines={1}
        style={
          styles.greeting
        }
      >
        Hi, {name}
      </Text>
    </SafeAreaView>
  );
}

function Hero() {
  return (
    <View
      style={
        styles.heroZone
      }
    >
      <ImageBackground
        source={require(
          '../../../assets/brand/volte-mobile-home-hero.png'
        )}
        resizeMode="cover"
        imageStyle={
          styles.heroImage
        }
        style={
          styles.heroCard
        }
      >
        <View
          style={
            styles.heroShade
          }
        />

        <View
          style={
            styles.heroContent
          }
        >
          <Text
            style={
              styles.heroEyebrow
            }
          >
            POWERING EVERY CONNECTION!
          </Text>

          <Text
            style={
              styles.heroTitle
            }
          >
            Explore{'\n'}
            what's next.
          </Text>

          <Text
            style={
              styles.heroBody
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
              styles.heroButton,
              pressed &&
                styles.pressed,
            ]}
          >
            <Text
              style={
                styles.heroButtonText
              }
            >
              Shop VoLTE Mobile
            </Text>

            <Text
              style={
                styles.heroButtonArrow
              }
            >
              ›
            </Text>
          </Pressable>
        </View>
      </ImageBackground>

      <View
        style={
          styles.carouselDots
        }
      >
        <View
          style={[
            styles.carouselDot,
            styles.carouselDotActive,
          ]}
        />

        <View
          style={
            styles.carouselDot
          }
        />

        <View
          style={
            styles.carouselDot
          }
        />
      </View>
    </View>
  );
}

function BagIcon() {
  return (
    <View
      style={
        styles.activityIconBubble
      }
    >
      <View
        style={
          styles.bag
        }
      >
        <View
          style={
            styles.bagHandle
          }
        />
      </View>
    </View>
  );
}

function RecentActivity({
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
              styles.sectionEyebrow
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
          onPress={
            onViewAll
          }
          hitSlop={8}
          style={({
            pressed,
          }) =>
            pressed
              ? styles.pressed
              : undefined
          }
        >
          <Text
            style={
              styles.viewAll
            }
          >
            View all ›
          </Text>
        </Pressable>
      </View>

      <View
        style={
          styles.activityCard
        }
      >
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
          <>
            <BagIcon />

            <View
              style={
                styles.activityCopy
              }
            >
              <Text
                style={
                  styles.cardTitle
                }
              >
                Recent activity unavailable
              </Text>

              <Text
                style={
                  styles.bodyText
                }
              >
                Please try again shortly.
              </Text>
            </View>
          </>
        ) : order ? (
          <>
            <BagIcon />

            <View
              style={
                styles.activityCopy
              }
            >
              <Text
                numberOfLines={1}
                style={
                  styles.cardTitle
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

              <View
                style={
                  styles.orderMeta
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
            </View>
          </>
        ) : (
          <>
            <BagIcon />

            <View
              style={
                styles.activityCopy
              }
            >
              <Text
                style={
                  styles.cardTitle
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
          </>
        )}
      </View>
    </View>
  );
}

function OffersPreview({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <View
      style={
        styles.section
      }
    >
      <Text
        style={
          styles.sectionEyebrow
        }
      >
        YOUR OFFERS
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={
          onPress
        }
        style={({
          pressed,
        }) => [
          styles.offerCard,
          pressed &&
            styles.pressed,
        ]}
      >
        <View
          style={
            styles.offerGlowOne
          }
        />

        <View
          style={
            styles.offerGlowTwo
          }
        />

        <View
          style={
            styles.offerIconBubble
          }
        >
          <Text
            style={
              styles.offerIcon
            }
          >
            ◇
          </Text>
        </View>

        <View
          style={
            styles.offerCopy
          }
        >
          <Text
            style={
              styles.cardTitle
            }
          >
            Something for you.
          </Text>

          <Text
            style={
              styles.bodyText
            }
          >
            Personalized VoLTE Mobile
            offers will appear here.
          </Text>
        </View>

        <View
          style={
            styles.offerArrowBubble
          }
        >
          <Text
            style={
              styles.offerArrow
            }
          >
            ›
          </Text>
        </View>
      </Pressable>
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
        name={name}
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
      >
        <Hero />

        <View
          style={
            styles.content
          }
        >
          <RecentActivity
            orders={orders}
            loading={loading}
            failed={failed}
            onViewAll={() =>
              router.navigate(
                '/order-history',
              )
            }
          />

          <OffersPreview
            onPress={() =>
              router.navigate(
                '/offers',
              )
            }
          />
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
        APP_BG,
    },

    headerSafe: {
      backgroundColor:
        BLACK,
      paddingBottom: 14,
    },

    headerRow: {
      minHeight: 48,
      paddingHorizontal: 20,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
    },

    brandIcon: {
      width: 27,
      height: 31,
    },

    searchButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#272A31',
      borderWidth: 1,
      borderColor:
        '#363A43',
    },

    searchIcon: {
      width: 20,
      height: 20,
      position:
        'relative',
    },

    searchLens: {
      position:
        'absolute',
      left: 1,
      top: 1,
      width: 13,
      height: 13,
      borderRadius: 7,
      borderWidth: 2,
      borderColor:
        '#FFFFFF',
    },

    searchHandle: {
      position:
        'absolute',
      right: 0,
      bottom: 3,
      width: 8,
      height: 2,
      borderRadius: 1,
      backgroundColor:
        '#FFFFFF',
      transform: [
        {
          rotate:
            '45deg',
        },
      ],
    },

    greeting: {
      paddingHorizontal: 20,
      paddingTop: 7,
      color:
        '#FFFFFF',
      fontSize: 24,
      lineHeight: 29,
      fontWeight:
        '700',
      letterSpacing:
        -0.5,
    },

    scroll: {
      flex: 1,
      backgroundColor:
        APP_BG,
    },

    scrollContent: {
      paddingBottom: 34,
    },

    heroZone: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 14,
      backgroundColor:
        BLACK,
    },

    heroCard: {
      minHeight: 272,
      borderRadius: 22,
      overflow:
        'hidden',
      justifyContent:
        'center',
    },

    heroImage: {
      borderRadius: 22,
    },

    heroShade: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor:
        'rgba(4, 4, 8, 0.08)',
    },

    heroContent: {
      width: '64%',
      paddingLeft: 20,
      paddingVertical: 22,
      gap: 12,
    },

    heroEyebrow: {
      color:
        '#F6EEF4',
      fontSize: 10,
      lineHeight: 14,
      fontWeight:
        '700',
      letterSpacing: 1.5,
    },

    heroTitle: {
      color:
        '#FFFFFF',
      fontSize: 30,
      lineHeight: 34,
      fontWeight:
        '700',
      letterSpacing:
        -0.8,
    },

    heroBody: {
      color:
        '#E4DCE3',
      fontSize: 14,
      lineHeight: 20,
    },

    heroButton: {
      minHeight: 46,
      marginTop: 4,
      paddingHorizontal: 16,
      borderRadius: 24,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap: 8,
      backgroundColor:
        '#FFFFFF',
    },

    heroButtonText: {
      color:
        MAGENTA,
      fontSize: 14,
      fontWeight:
        '700',
    },

    heroButtonArrow: {
      color:
        MAGENTA,
      fontSize: 23,
      lineHeight: 23,
      fontWeight:
        '500',
    },

    carouselDots: {
      height: 20,
      paddingTop: 10,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap: 8,
    },

    carouselDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor:
        '#3B404A',
    },

    carouselDotActive: {
      width: 18,
      backgroundColor:
        MAGENTA,
    },

    content: {
      paddingHorizontal: 16,
      paddingTop: 26,
      gap: 28,
    },

    section: {
      gap: 11,
    },

    sectionHeader: {
      flexDirection:
        'row',
      alignItems:
        'flex-end',
      justifyContent:
        'space-between',
      gap: 12,
    },

    sectionHeading: {
      flex: 1,
      gap: 4,
    },

    sectionEyebrow: {
      color:
        MAGENTA,
      fontSize: 11,
      lineHeight: 15,
      fontWeight:
        '700',
      letterSpacing: 1.2,
    },

    sectionTitle: {
      color:
        INK,
      fontSize: 20,
      lineHeight: 25,
      fontWeight:
        '700',
      letterSpacing:
        -0.3,
    },

    viewAll: {
      color:
        PURPLE,
      fontSize: 13,
      lineHeight: 18,
      fontWeight:
        '700',
    },

    activityCard: {
      minHeight: 116,
      padding: 17,
      borderRadius: 22,
      borderWidth: 1,
      borderColor:
        BORDER,
      backgroundColor:
        SURFACE,
      flexDirection:
        'row',
      alignItems:
        'center',
      gap: 15,

      shadowColor:
        '#000000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.04,
      shadowRadius: 15,
      elevation: 1,
    },

    activityIconBubble: {
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#F0F2F6',
    },

    bag: {
      width: 23,
      height: 24,
      marginTop: 5,
      borderWidth: 2,
      borderRadius: 3,
      borderColor:
        '#697284',
    },

    bagHandle: {
      position:
        'absolute',
      top: -8,
      left: 5,
      width: 11,
      height: 10,
      borderWidth: 2,
      borderBottomWidth: 0,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderColor:
        '#697284',
    },

    activityCopy: {
      flex: 1,
      gap: 5,
    },

    cardTitle: {
      color:
        INK,
      fontSize: 17,
      lineHeight: 22,
      fontWeight:
        '700',
      letterSpacing:
        -0.2,
    },

    bodyText: {
      color:
        MUTED,
      fontSize: 14,
      lineHeight: 20,
    },

    loadingRow: {
      flexDirection:
        'row',
      alignItems:
        'center',
      gap: 12,
    },

    orderMeta: {
      marginTop: 5,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      gap: 10,
    },

    orderAmount: {
      color:
        INK,
      fontSize: 14,
      fontWeight:
        '700',
    },

    paidStatus: {
      color:
        '#16854B',
      fontSize: 11,
      fontWeight:
        '700',
    },

    orderStatus: {
      color:
        MUTED,
      fontSize: 11,
      fontWeight:
        '700',
    },

    offerCard: {
      minHeight: 118,
      padding: 17,
      borderRadius: 22,
      borderWidth: 1,
      borderColor:
        '#E5DFE8',
      backgroundColor:
        SURFACE,
      overflow:
        'hidden',
      flexDirection:
        'row',
      alignItems:
        'center',
      gap: 15,

      shadowColor:
        '#000000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.04,
      shadowRadius: 15,
      elevation: 1,
    },

    offerGlowOne: {
      position:
        'absolute',
      width: 150,
      height: 150,
      borderRadius: 75,
      right: -42,
      top: -72,
      backgroundColor:
        '#F7EAF4',
    },

    offerGlowTwo: {
      position:
        'absolute',
      width: 130,
      height: 130,
      borderRadius: 65,
      right: 18,
      bottom: -88,
      backgroundColor:
        '#F4ECFF',
    },

    offerIconBubble: {
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#FBEAF3',
    },

    offerIcon: {
      color:
        MAGENTA,
      fontSize: 31,
      lineHeight: 34,
      fontWeight:
        '500',
    },

    offerCopy: {
      flex: 1,
      gap: 5,
    },

    offerArrowBubble: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        'rgba(255,255,255,0.82)',
    },

    offerArrow: {
      color:
        PURPLE,
      fontSize: 26,
      lineHeight: 27,
      fontWeight:
        '500',
    },

    pressed: {
      opacity: 0.76,
    },
  });
