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
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';

import { BiometricGate } from '@/lib/auth/biometric-unlock';

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
        lineHeight: 21,
        fontWeight: '600',
      }}
    >
      {glyph}
    </Text>
  );
}

export default function CustomerAppLayout() {
  const {
    status,
    customer,
  } =
    useCustomerSession();

  const insets =
    useSafeAreaInsets();

  const bottomInset =
    Math.max(
      insets.bottom,
      14,
    );

  if (
    status === 'loading'
  ) {
    return (
      <View
        style={{
          flex: 1,
          alignItems:
            'center',
          justifyContent:
            'center',
          backgroundColor:
            '#F3F5F8',
        }}
      >
        <ActivityIndicator
          size="small"
        />
      </View>
    );
  }

  if (
    status !==
    'authenticated' || !customer
  ) {
    return (
      <Redirect
        href="/"
      />
    );
  }

  return (
    <BiometricGate key={customer.id} customerId={customer.id}>
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          '#C51B74',

        tabBarInactiveTintColor:
          '#697284',

        tabBarHideOnKeyboard:
          true,

        tabBarStyle: {
          height:
            60 +
            bottomInset,

          minHeight:
            60 +
            bottomInset,

          paddingTop: 7,

          paddingBottom:
            bottomInset,

          backgroundColor:
            '#FFFFFF',

          borderTopWidth: 0,

          borderTopLeftRadius: 22,

          borderTopRightRadius: 22,

          shadowColor:
            '#000000',

          shadowOffset: {
            width: 0,
            height: -5,
          },

          shadowOpacity: 0.05,

          shadowRadius: 14,

          elevation: 8,
        },

        tabBarItemStyle: {
          paddingTop: 1,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          lineHeight: 13,
          fontWeight: '600',
          marginBottom: 0,
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
              color={
                color
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title:
            'Services',

          tabBarIcon: ({
            color,
          }) => (
            <TabGlyph
              glyph="▦"
              color={
                color
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="finance"
        options={{
          title:
            'Finance',

          tabBarIcon: ({
            color,
          }) => (
            <TabGlyph
              glyph="$"
              color={
                color
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="offers"
        options={{
          title:
            'Offers',

          tabBarIcon: ({
            color,
          }) => (
            <TabGlyph
              glyph="✦"
              color={
                color
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title:
            'More',

          tabBarIcon: ({
            color,
          }) => (
            <TabGlyph
              glyph="☰"
              color={
                color
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="support"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          href: null,
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
        name="order-history"
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
    </BiometricGate>
  );
}
