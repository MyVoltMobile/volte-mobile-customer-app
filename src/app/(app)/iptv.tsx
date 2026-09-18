import {
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
  Colors,
  Spacing,
  Typography,
} from '@/theme/tokens';

export default function IptvScreen() {
  return (
    <ShellScreen
      eyebrow="Services"
      title="My IPTV"
      description="Your VoLTE Mobile entertainment service."
    >
      <Card>
        <View
          style={
            styles.content
          }
        >
          <Text
            style={
              styles.title
            }
          >
            IPTV account access
          </Text>

          <Text
            style={
              styles.text
            }
          >
            Your IPTV package,
            service status and
            renewal information
            will appear here once
            the customer-safe IPTV
            connection is enabled.
          </Text>
        </View>
      </Card>
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    content: {
      gap:
        Spacing.sm,
    },

    title: {
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

    text: {
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
  });
