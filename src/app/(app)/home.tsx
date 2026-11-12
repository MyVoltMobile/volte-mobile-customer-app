import {
  useRouter,
  usePathname,
} from 'expo-router';

import { StatusBar } from 'expo-status-bar';

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
  useWindowDimensions,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  getCustomerOrders,
  type CustomerOrder,
} from '@/lib/customer/customer-orders';

import {
  getCustomerPromotions,
  type CustomerPromotion,
} from '@/lib/customer/customer-promotions';

import {
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';

const SHOP_URL =
  'https://voltemobile.com/shop';

const CHARCOAL = '#414042';

const APP_BG =
  '#F5F5F7';

const SURFACE =
  '#FFFFFF';

const INK =
  '#11131A';

const MUTED =
  '#6E6E73';

const BORDER =
  '#E0E4EB';

const MAGENTA =
  '#C51B74';

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

function HeroSlide({
  promotion,
  width,
}: {
  promotion:
    | CustomerPromotion
    | null;
  width: number;
}) {
  const fallback =
    promotion === null;

  const imageSource =
    promotion?.imageUrl
      ? {
          uri:
            promotion.imageUrl,
        }
      : require(
          '../../../assets/brand/volte-mobile-home-hero.png',
        );

  const sponsored = promotion?.eyebrow?.trim().toLowerCase() === 'sponsored';

  const eyebrow =
    (sponsored ? 'Sponsored' : promotion?.eyebrow) ||
    'POWERING EVERY CONNECTION!';

  const description =
    promotion?.description ||
    'Discover devices, accessories and services from VoLTE Mobile.';

  const ctaLabel =
    promotion
      ? promotion.ctaLabel
      : 'Shop VoLTE Mobile';

  const ctaUrl =
    promotion
      ? promotion.ctaUrl
      : SHOP_URL;

  return (
    <ImageBackground
      source={
        imageSource
      }
      resizeMode="cover"
      imageStyle={
        styles.heroImage
      }
      style={[
        styles.heroCard,
        {
          width,
        },
      ]}
      accessibilityLabel={
        promotion
          ? `${promotion.headline} promotion`
          : 'VoLTE Mobile'
      }
    >
      <View
        style={[
          styles.heroShade,
          !fallback && {
            backgroundColor:
              'rgba(4, 4, 8, 0.38)',
          },
        ]}
      />

      <View
        style={
          styles.heroContent
        }
      >
        <Text
          numberOfLines={1}
          style={
            styles.heroEyebrow
          }
        >
          {eyebrow}
        </Text>

        <Text
          numberOfLines={
            promotion
              ? 2
              : undefined
          }
          style={
            styles.heroTitle
          }
        >
          {promotion
            ? promotion.headline
            : (
                <>
                  Explore{'\n'}
                  what's next.
                </>
              )}
        </Text>

        <Text
          numberOfLines={2}
          style={
            styles.heroBody
          }
        >
          {description}
        </Text>

        {!sponsored && ctaLabel &&
        ctaUrl ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              ctaLabel
            }
            onPress={() => {
              void Linking
                .openURL(
                  ctaUrl,
                )
                .catch(
                  () => {},
                );
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
              numberOfLines={1}
              style={
                styles.heroButtonText
              }
            >
              {ctaLabel}
            </Text>

            <Text
              style={
                styles.heroButtonArrow
              }
            >
              ›
            </Text>
          </Pressable>
        ) : null}
      </View>
    </ImageBackground>
  );
}

function Hero() {
  const {
    width:
      windowWidth,
  } =
    useWindowDimensions();

  const slideWidth =
    Math.max(
      windowWidth - 32,
      280,
    );

  const [
    promotions,
    setPromotions,
  ] =
    useState<
      CustomerPromotion[]
    >([]);

  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  useEffect(() => {
    let active = true;

    async function loadPromotions() {
      try {
        const result =
          await getCustomerPromotions();

        if (!active) {
          return;
        }

        setPromotions(
          result,
        );

        setActiveIndex(
          0,
        );
      } catch {
        if (!active) {
          return;
        }

        setPromotions(
          [],
        );

        setActiveIndex(
          0,
        );
      }
    }

    void loadPromotions();

    return () => {
      active = false;
    };
  }, []);

  const hasPromotions =
    promotions.length >
    0;

  return (
    <View
      style={
        styles.heroZone
      }
    >
      <View pointerEvents="none" style={styles.heroBackdrop} />
      <ScrollView
        horizontal
        pagingEnabled
        bounces={
          promotions.length >
          1
        }
        scrollEnabled={
          promotions.length >
          1
        }
        showsHorizontalScrollIndicator={
          false
        }
        style={
          styles.heroCarousel
        }
        onMomentumScrollEnd={(
          event,
        ) => {
          if (
            promotions.length <=
            1
          ) {
            return;
          }

          const nextIndex =
            Math.round(
              event
                .nativeEvent
                .contentOffset
                .x /
                slideWidth,
            );

          setActiveIndex(
            Math.max(
              0,
              Math.min(
                nextIndex,
                promotions.length -
                  1,
              ),
            ),
          );
        }}
      >
        {hasPromotions
          ? promotions.map(
              (
                promotion,
              ) => (
                <HeroSlide
                  key={
                    promotion.id
                  }
                  promotion={
                    promotion
                  }
                  width={
                    slideWidth
                  }
                />
              ),
            )
          : (
              <HeroSlide
                promotion={
                  null
                }
                width={
                  slideWidth
                }
              />
            )}
      </ScrollView>

      {promotions.length >
      1 ? (
        <View
          style={
            styles.carouselDots
          }
        >
          {promotions.map(
            (
              promotion,
              index,
            ) => (
              <View
                key={
                  promotion.id
                }
                style={[
                  styles.carouselDot,
                  index ===
                    activeIndex &&
                    styles.carouselDotActive,
                ]}
              />
            ),
          )}
        </View>
      ) : null}
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
        <Text
          style={
            styles.sectionTitle
          }
        >
          Recent activity
        </Text>

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
          styles.sectionTitle
        }
      >
        Offers
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
            styles.offerCopy
          }
        >
          <Text
            style={
              styles.cardTitle
            }
          >
            Your offers
          </Text>

          <Text
            style={
              styles.bodyText
            }
          >
            See offers selected for
            your VoLTE Mobile account.
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
  );
}

export default function HomeScreen() {
  const pathname = usePathname();
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
      {pathname === '/home' && <StatusBar style="light" />}
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
        CHARCOAL,
      paddingBottom: 10,
    },

    headerRow: {
      minHeight: 44,
      paddingHorizontal: 20,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
    },

    brandIcon: {
      width: 22,
      height: 24,
    },

    searchButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#F2F2F4',
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
        '#20232A',
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
        '#20232A',
      transform: [
        {
          rotate:
            '45deg',
        },
      ],
    },

    greeting: {
      paddingHorizontal: 20,
      paddingTop: 4,
      color:
        SURFACE,
      fontSize: 28,
      lineHeight: 34,
      fontWeight:
        '700',
      letterSpacing:
        -0.7,
    },

    scroll: {
      flex: 1,
      backgroundColor:
        APP_BG,
    },

    scrollContent: {
      paddingBottom: 30,
    },

    heroZone: {
      position: 'relative',
      paddingHorizontal: 16,
      paddingTop: 6,
      backgroundColor:
        APP_BG,
    },

    heroBackdrop: {
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 82, backgroundColor: CHARCOAL,
    },

    heroCarousel: {
      height: 272,
    },

    heroCard: {
      height: 272,
      overflow:
        'hidden',
      justifyContent:
        'flex-end',
      borderRadius: 26,
      backgroundColor:
        '#15161A',
    },

    heroImage: {
      borderRadius: 26,
    },

    heroShade: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor:
        'rgba(4, 4, 8, 0.18)',
    },

    heroContent: {
      flex: 1,
      width: '64%',
      justifyContent:
        'flex-end',
      paddingLeft: 22,
      paddingRight: 12,
      paddingTop: 24,
      paddingBottom: 22,
      gap: 6,
    },

    heroEyebrow: {
      color:
        '#F6EEF4',
      fontSize: 9,
      lineHeight: 13,
      fontWeight:
        '700',
      letterSpacing: 1.35,
    },

    heroTitle: {
      color:
        '#FFFFFF',
      fontSize: 27,
      lineHeight: 30,
      fontWeight:
        '700',
      letterSpacing:
        -0.7,
    },

    heroBody: {
      color:
        'rgba(255,255,255,0.88)',
      fontSize: 13,
      lineHeight: 18,
    },

    heroButton: {
      minHeight: 40,
      marginTop: 4,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignSelf:
        'flex-start',
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap: 7,
      backgroundColor:
        'rgba(255,255,255,0.94)',
    },

    heroButtonText: {
      color:
        '#1D1D1F',
      fontSize: 13,
      fontWeight:
        '700',
    },

    heroButtonArrow: {
      color:
        '#1D1D1F',
      fontSize: 23,
      lineHeight: 23,
      fontWeight:
        '500',
    },

    carouselDots: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 10,
      height: 10,
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
        'rgba(255, 255, 255, 0.62)',
    },

    carouselDotActive: {
      width: 18,
      backgroundColor:
        MAGENTA,
    },

    content: {
      paddingHorizontal: 16,
      paddingTop: 28,
      gap: 30,
    },

    section: {
      gap: 12,
    },

    sectionHeader: {
      flexDirection:
        'row',
      alignItems:
        'center',
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
      fontSize: 10,
      lineHeight: 14,
      fontWeight:
        '700',
      letterSpacing: 1.0,
    },

    sectionTitle: {
      color:
        INK,
      fontSize: 20,
      lineHeight: 25,
      fontWeight:
        '700',
      letterSpacing:
        -0.35,
    },

    viewAll: {
      color:
        MAGENTA,
      fontSize: 13,
      lineHeight: 18,
      fontWeight:
        '600',
    },

    activityCard: {
      minHeight: 104,
      padding: 18,
      borderRadius: 22,
      backgroundColor:
        SURFACE,
      flexDirection:
        'row',
      alignItems:
        'center',
      gap: 14,

      shadowColor:
        '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.045,
      shadowRadius: 14,
      elevation: 1,
    },

    activityIconBubble: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#F1F2F4',
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
      minHeight: 96,
      padding: 18,
      borderRadius: 22,
      backgroundColor:
        SURFACE,
      overflow:
        'hidden',
      flexDirection:
        'row',
      alignItems:
        'center',
      gap: 14,

      shadowColor:
        '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.025,
      shadowRadius: 9,
      elevation: 0,
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
      width: 50,
      height: 50,
      borderRadius: 25,
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
      fontSize: 27,
      lineHeight: 30,
      fontWeight:
        '500',
    },

    offerCopy: {
      flex: 1,
      gap: 5,
    },

    offerArrowBubble: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#F3F4F6',
    },

    offerArrow: {
      color:
        '#8E8E93',
      fontSize: 28,
      lineHeight: 30,
      fontWeight:
        '400',
      marginLeft: 4,
    },

    pressed: {
      opacity: 0.76,
    },
  });
