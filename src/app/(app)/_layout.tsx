import { Stack } from 'expo-router';

export default function CustomerAppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
