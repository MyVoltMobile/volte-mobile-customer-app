import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import {
  CustomerSessionProvider,
} from '@/lib/customer/customer-session-provider';
import { StartupVideoOverlay } from '@/components/launch/StartupVideoOverlay';

export default function RootLayout() {
  return (
    <CustomerSessionProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="auto" />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />

        <StartupVideoOverlay />
      </View>
    </CustomerSessionProvider>
  );
}
