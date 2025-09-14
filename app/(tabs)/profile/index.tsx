import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ModeSwitcher from "../../../components/ModeSwitcher";

export default function Profile() {
  const router = useRouter();

  

  const settingsOptions = [
    { id: 'settings', name: 'Settings', icon: 'settings' },
    { id: 'developers', name: 'Developers', icon: 'code' },
    { id: 'credits', name: 'Credits', icon: 'award' },
    { id: 'app-version', name: 'App Version', icon: 'info' }, // Changed 'version' to 'app-version' to match _layout.tsx
  ];

  const handleSettingPress = (id: string) => {
    router.push(`/profile/${id}`);
  };

  

  return (
    <View className="flex-1 bg-black p-4">
      {/* Profile Card */}
      <View
        className="bg-neutral-800 rounded-lg mb-6 overflow-hidden"
      >
        <Image
          source={require("../../../assets/images/fx1.jpg")}
          className="w-full h-48"
        />
      </View>

      {/* Mode Switcher */}
      <ModeSwitcher />

      {/* Combined Options Section */}
      <View className="bg-neutral-800 rounded-lg mb-6 overflow-hidden">
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            className={`flex-row items-center p-4 ${index < settingsOptions.length - 1 ? 'border-b border-black' : ''}`}
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
