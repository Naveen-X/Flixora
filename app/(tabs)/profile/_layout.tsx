import { Stack } from "expo-router";
import { View } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';

export default function ProfileScreenStack() {
  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      <Stack screenOptions={{
        contentStyle: { backgroundColor: 'transparent' },
        header: ({ options }) => <CustomHeader title={options.headerTitle} />,
        cardStyle: { backgroundColor: 'transparent' },
        screenOrientation: 'portrait', // Lock orientation to portrait
        animation: 'slide_from_right',
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerTitle: 'Settings' }} />
        <Stack.Screen name="developers" options={{ headerTitle: 'Developers' }} />
        <Stack.Screen name="credits" options={{ headerTitle: 'Credits' }} />
        <Stack.Screen name="app-version" options={{ headerTitle: 'App Version' }} />
        <Stack.Screen name="account-details" options={{ headerTitle: 'Account Details' }} />
      </Stack>
    </View>
  );
}