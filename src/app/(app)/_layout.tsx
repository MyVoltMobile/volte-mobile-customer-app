import {
  Redirect,
  Tabs,
} from 'expo-router';

import {
  ActivityIndicator,
  Text,
  View,
  type ColorValue,
} from 'react-native';

import {
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';

import {
  Colors,
} from '@/theme/tokens';

function TabGlyph({
  glyph,
  color,
}: {
  glyph: string;
  color: ColorValue;
}) {
  return (
    <Text
      style={{
        color,
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '800',
      }}
    >
      {glyph}
    </Text>
  );
}

export default function CustomerAppLayout() {
  const {
    status,
  } = useCustomerSession();

  if (status === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent:
            'center',
          backgroundColor:
            Colors.background.app,
        }}
      >
        <ActivityIndicator
          size="small"
        />
      </View>
    );
  }

  if (
    status !== 'authenticated'
  ) {
    return (
      <Redirect href="/" />
    );
  }

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          Colors.brand.secondary,

        tabBarInactiveTintColor:
          Colors.text.secondary,

        tabBarStyle: {
          minHeight: 70,
          paddingTop: 7,
          paddingBottom: 8,
          backgroundColor:
            Colors.background
              .surface,
          borderTopColor:
            Colors.border.default,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',

          tabBarIcon: ({
            color,
          }) => (
            <TabGlyph
              glyph="⌂"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',

          tabBarIcon: ({
            color,
          }) => (
            <TabGlyph
              glyph="◫"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finance',

          tabBarIcon: ({
            color,
          }) => (
            <TabGlyph
              glyph="$"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',

          tabBarIcon: ({
            color,
          }) => (
            <TabGlyph
              glyph="?"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: 'More',

          tabBarIcon: ({
            color,
          }) => (
            <TabGlyph
              glyph="☰"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="devices"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="esim"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="iptv"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
