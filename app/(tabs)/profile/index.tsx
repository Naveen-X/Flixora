import ModeSwitcher from "../../../components/ModeSwitcher";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const router = useRouter();

  // Placeholder data for profile (will be replaced by Google account data)
  const userProfile = {
    name: "Test Mail",
    email: "testmail@gmail.com",
    profilePic: require("../../../assets/images/flixora.jpg"), // Placeholder image
  };

  const settingsOptions = [
    { id: 'settings', name: 'Settings', icon: 'settings' },
    { id: 'developers', name: 'Developers', icon: 'code' },
    { id: 'credits', name: 'Credits', icon: 'award' },
    { id: 'app-version', name: 'App Version', icon: 'info' }, // Changed 'version' to 'app-version' to match _layout.tsx
  ];

  const handleSettingPress = (id: string) => {
    router.push(`/profile/${id}`);
  };

  const handleAccountPress = () => {
    router.push({
      pathname: "/profile/account-details",
      params: userProfile,
    });
  };

  return (
    <View className="flex-1 bg-slate-950 p-4 pt-16">
      {/* Profile Card */}
      <TouchableOpacity
        className="bg-neutral-800 rounded-lg p-4 flex-row items-center mb-6"
        onPress={handleAccountPress}
      >
        <Image
          source={userProfile.profilePic}
          className="w-20 h-20 rounded-full mr-4 border-2 border-white"
        />
        <View>
          <Text className="text-white text-xl font-bold">{userProfile.name}</Text>
          <Text className="text-gray-400 text-base">{userProfile.email}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#808080" className="ml-auto" />
      </TouchableOpacity>

      {/* Mode Switcher */}
      <ModeSwitcher />

      {/* Combined Options Section */}
      <View className="bg-neutral-800 rounded-lg mb-6 overflow-hidden">
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            className={`flex-row items-center p-4 ${index < settingsOptions.length - 1 ? 'border-b border-neutral-700' : ''}`}
            onPress={() => handleSettingPress(option.id)}
          >
            <Feather name={option.icon} size={22} color="#FFFFFF" className="mr-4" />
            <Text className="text-white text-lg flex-1">{option.name}</Text>
            <Feather name="chevron-right" size={20} color="#808080" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
