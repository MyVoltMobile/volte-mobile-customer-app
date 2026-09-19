import {
  Linking,
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
  Colors,
  Spacing,
  Typography,
} from '@/theme/tokens';

const SHOP_URL =
  'https://voltemobile.com/shop';

export default function OffersScreen() {
  return (
    <ShellScreen
      eyebrow="Discover"
      title="Your Offers"
      description="Personalized opportunities from VoLTE Mobile."
    >
      <View
        style={
          styles.content
        }
      >
        <Card>
          <View
            style={
              styles.empty
            }
          >
            <Text
              style={
                styles.badge
              }
            >
              FOR YOU
            </Text>

            <Text
              style={
                styles.title
              }
            >
              No offers available yet
            </Text>

            <Text
              style={
                styles.description
              }
            >
              Personalized offers,
              upgrades and special
              opportunities will appear
              here as they become
              available.
            </Text>
          </View>
        </Card>

        <Button
          label="Explore VoLTE Mobile"
          onPress={() => {
            void Linking
              .openURL(
                SHOP_URL,
              )
              .catch(() => {});
          }}
        />
      </View>
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    content: {
      gap:
        Spacing.md,
    },

    empty: {
      gap:
        Spacing.md,
      alignItems:
        'flex-start',
    },

    badge: {
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
        Typography.size.titleSmall,
      fontWeight:
        '700',
    },

    description: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight.body,
    },
  });
