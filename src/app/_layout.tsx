import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import {
  CustomerSessionProvider,
} from '@/lib/customer/customer-session-provider';

export default function RootLayout() {

  return (
    <CustomerSessionProvider>
      <StatusBar style="auto" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </CustomerSessionProvider>
  );
}
