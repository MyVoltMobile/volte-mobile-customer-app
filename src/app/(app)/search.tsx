import {
  useMemo,
  useState,
} from 'react';

import {
  useRouter,
} from 'expo-router';

import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ShellScreen,
} from '@/components/shell/shell-screen';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

const SHOP_URL =
  'https://voltemobile.com/shop';

type DestinationKey =
  | 'devices'
  | 'esim'
  | 'iptv'
  | 'finance'
  | 'support'
  | 'orders'
  | 'offers'
  | 'shop';

const destinations = [
  ['devices', 'SERVICES', 'My Devices', 'Phones and devices linked to your account.', 'phone device imei handset'],
  ['esim', 'SERVICES', 'My eSIM', 'Your eSIM plans and installation information.', 'esim sim mobile data'],
  ['iptv', 'SERVICES', 'My IPTV', 'Your entertainment package and service access.', 'iptv tv entertainment'],
  ['finance', 'ACCOUNT', 'Finance', 'View active device-finance information.', 'finance payment balance credit monthly'],
  ['support', 'HELP', 'Support', 'Get help with your account and services.', 'support help problem issue contact'],
  ['orders', 'ACCOUNT', 'Order History', 'View online purchases and order activity.', 'orders purchase receipt history'],
  ['offers', 'DISCOVER', 'Your Offers', 'View personalized VoLTE Mobile offers.', 'offer deal promotion discount'],
  ['shop', 'SHOP', 'Shop VoLTE Mobile', 'Browse devices, accessories and services.', 'shop buy product phone accessories'],
] as const;

export default function SearchScreen() {
  const router =
    useRouter();

  const [
    query,
    setQuery,
  ] =
    useState('');

  const results =
    useMemo(() => {
      const search =
        query
          .trim()
          .toLowerCase();

      if (!search) {
        return destinations;
      }

      return destinations.filter(
        (item) =>
          item
            .join(' ')
            .toLowerCase()
            .includes(search),
      );
    }, [query]);

  function open(
    key: DestinationKey,
  ) {
    if (key === 'shop') {
      void Linking
        .openURL(
          SHOP_URL,
        )
        .catch(() => {});

      return;
    }

    const routes = {
      devices: '/devices',
      esim: '/esim',
      iptv: '/iptv',
      finance: '/finance',
      support: '/support',
      orders: '/order-history',
      offers: '/offers',
    } as const;

    router.navigate(
      routes[key],
    );
  }

  return (
    <ShellScreen
      eyebrow="Discover"
      title="Search"
      description="Find services, account tools and more from VoLTE Mobile."
    >
      <View
        style={
          styles.content
        }
      >
        <View
          style={
            styles.search
          }
        >
          <TextInput
            autoFocus
            value={query}
            onChangeText={
              setQuery
            }
            placeholder="Search VoLTE Mobile"
            placeholderTextColor={
              Colors.text.secondary
            }
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            style={
              styles.input
            }
          />
        </View>

        <Text
          style={
            styles.label
          }
        >
          {
            query.trim()
              ? 'RESULTS'
              : 'QUICK ACCESS'
          }
        </Text>

        {results.length ? (
          <View
            style={
              styles.results
            }
          >
            {results.map(
              ([
                key,
                group,
                title,
                description,
              ]) => (
                <Pressable
                  key={key}
                  accessibilityRole="button"
                  onPress={() =>
                    open(key)
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.row,
                    pressed &&
                      styles.rowPressed,
                  ]}
                >
                  <View
                    style={
                      styles.rowText
                    }
                  >
                    <Text
                      style={
                        styles.group
                      }
                    >
                      {group}
                    </Text>

                    <Text
                      style={
                        styles.title
                      }
                    >
                      {title}
                    </Text>

                    <Text
                      style={
                        styles.description
                      }
                    >
                      {description}
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.arrow
                    }
                  >
                    ›
                  </Text>
                </Pressable>
              ),
            )}
          </View>
        ) : (
          <View
            style={
              styles.empty
            }
          >
            <Text
              style={
                styles.emptyTitle
              }
            >
              No results found
            </Text>

            <Text
              style={
                styles.description
              }
            >
              Try another search.
            </Text>
          </View>
        )}
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

    search: {
      minHeight: 58,
      justifyContent:
        'center',
      paddingHorizontal:
        Spacing.lg,
      borderWidth: 1,
      borderColor:
        Colors.border.default,
      borderRadius:
        Radius.pill,
      backgroundColor:
        Colors.background.surface,
    },

    input: {
      minHeight: 56,
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
    },

    label: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
      letterSpacing: 1,
    },

    results: {
      overflow:
        'hidden',
      borderWidth: 1,
      borderColor:
        Colors.border.default,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.background.surface,
    },

    row: {
      minHeight: 108,
      padding:
        Spacing.lg,
      flexDirection:
        'row',
      alignItems:
        'center',
      gap:
        Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border.default,
    },

    rowPressed: {
      backgroundColor:
        Colors.background.subtle,
    },

    rowText: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    group: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
      letterSpacing: 0.8,
    },

    title: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
    },

    description: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight.bodySmall,
    },

    arrow: {
      color:
        Colors.brand.primary,
      fontSize: 32,
      fontWeight:
        '400',
    },

    empty: {
      gap:
        Spacing.md,
      padding:
        Spacing.xl,
      borderWidth: 1,
      borderColor:
        Colors.border.default,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.background.surface,
    },

    emptyTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.titleSmall,
      fontWeight:
        '700',
    },
  });
