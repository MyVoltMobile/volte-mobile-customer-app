import {
  Redirect,
  Stack,
} from 'expo-router';
import {
  ActivityIndicator,
  View,
} from 'react-native';

import {
  useCustomerSession,
} from '@/lib/customer/customer-session-provider';
import {
  Colors,
} from '@/theme/tokens';

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
          justifyContent: 'center',
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
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
