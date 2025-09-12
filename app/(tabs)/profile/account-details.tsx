import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';

export default function AccountDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { name, email } = params;

  const handleLogout = () => {
    console.log("Logging out...");
    // Implement actual logout logic here (e.g., clear tokens, navigate to login)
    Alert.alert("Logout", "You have been logged out.");
    router.replace('/profile'); // Go back to profile root after logout
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "This feature is not yet implemented.");
    // In a real app, you would navigate to an edit profile screen
  };

  return (
    <View className="flex-1 bg-black p-4 pt-16" style={{ backgroundColor: 'black' }}>
      <View className="bg-neutral-800 rounded-lg p-4 mb-4">
        <Text className="text-white text-lg mb-2">Name: {name}</Text>
        <Text className="text-white text-lg">Email: {email}</Text>
      </View>

      <TouchableOpacity
        className="bg-blue-600 p-4 rounded-lg items-center mb-4"
        onPress={handleEditProfile}
      >
        <Text className="text-white text-lg font-semibold">Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red-600 p-4 rounded-lg items-center"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
