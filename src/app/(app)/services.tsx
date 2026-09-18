import {
  useRouter,
} from 'expo-router';

import {
  Pressable,
  StyleSheet,
  Text,
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

function ServiceCard({
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
        styles.serviceCard,
        pressed &&
          styles.serviceCardPressed,
      ]}
    >
      <Text
        style={
          styles.serviceEyebrow
        }
      >
        {eyebrow}
      </Text>

      <Text
        style={
          styles.serviceTitle
        }
      >
        {title}
      </Text>

      <Text
        style={
          styles.serviceDescription
        }
      >
        {description}
      </Text>

      <Text
        style={
          styles.serviceAction
        }
      >
        Manage →
      </Text>
    </Pressable>
  );
}

export default function ServicesScreen() {
  const router =
    useRouter();

  return (
    <ShellScreen
      eyebrow="VoLTE Mobile"
      title="Services"
      description="Manage the products and services connected to your account."
    >
      <View
        style={
          styles.list
        }
      >
        <ServiceCard
          eyebrow="DEVICE"
          title="My Devices"
          description="Phones and devices linked to your account."
          onPress={() =>
            router.navigate(
              '/devices',
            )
          }
        />

        <ServiceCard
          eyebrow="MOBILE"
          title="My eSIM"
          description="View your eSIM plans, status and installation options."
          onPress={() =>
            router.navigate(
              '/esim',
            )
          }
        />

        <ServiceCard
          eyebrow="ENTERTAINMENT"
          title="My IPTV"
          description="Your IPTV service, package and renewal information."
          onPress={() =>
            router.navigate(
              '/iptv',
            )
          }
        />
      </View>
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    list: {
      gap:
        Spacing.md,
    },

    serviceCard: {
      minHeight: 168,
      borderRadius:
        Radius.lg,
      borderWidth: 1,
      borderColor:
        Colors.border.default,
      backgroundColor:
        Colors.background
          .surface,
      padding:
        Spacing.xl,
      gap:
        Spacing.sm,
    },

    serviceCardPressed: {
      backgroundColor:
        Colors.background
          .subtle,
    },

    serviceEyebrow: {
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
      letterSpacing: 0.8,
    },

    serviceTitle: {
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

    serviceDescription: {
      flexGrow: 1,
      color:
        Colors.text
          .secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    serviceAction: {
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
  });
