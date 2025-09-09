import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function AccountDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { name, email } = params;

  const handleLogout = () => {
    console.log("Logging out...");
    // Implement logout logic here
    router.replace('/profile'); // Go back to profile root after logout
  };

  return (
    <View className="flex-1 bg-black p-4 pt-16" style={{ backgroundColor: 'black' }}>
      <View className="bg-neutral-800 rounded-lg p-4 mb-4">
        <Text className="text-white text-lg mb-2">Name: {name}</Text>
        <Text className="text-white text-lg">Email: {email}</Text>
      </View>
      <TouchableOpacity
        className="bg-white p-4 rounded-lg items-center"
        onPress={handleLogout}
      >
        <Text className="text-black text-lg font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
