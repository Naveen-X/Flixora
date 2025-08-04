import { Stack } from "expo-router";

export default function ProfileScreenStack() {
  return (
    <Stack screenOptions={{
      contentStyle: { backgroundColor: '#020617' },
      headerStyle: { backgroundColor: '#020617' },
      headerTintColor: '#FFFFFF',
      cardStyle: { backgroundColor: '#020617' },
      screenOrientation: 'portrait', // Lock orientation to portrait
      animation: 'slide_from_right',
      screenBackgroundColor: '#020617',
      transparentCard: false,
    }}>
      <Stack.Screen name="index" options={{ headerShown: false, cardStyle: { backgroundColor: '#020617' } }} />
      <Stack.Screen name="settings" options={{ headerShown: true, headerTitle: 'Settings', cardStyle: { backgroundColor: '#020617' } }} />
      <Stack.Screen name="developers" options={{ headerShown: true, headerTitle: 'Developers', cardStyle: { backgroundColor: '#020617' } }} />
      <Stack.Screen name="credits" options={{ headerShown: true, headerTitle: 'Credits', cardStyle: { backgroundColor: '#020617' } }} />
      <Stack.Screen name="app-version" options={{ headerShown: true, headerTitle: 'App Version', cardStyle: { backgroundColor: '#020617' } }} />
      <Stack.Screen name="account-details" options={{ headerShown: true, headerTitle: 'Account Details', cardStyle: { backgroundColor: '#020617' } }} />
    </Stack>
  );
}