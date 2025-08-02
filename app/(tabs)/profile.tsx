import { Feather } from "@expo/vector-icons";
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  // Placeholder data for profile (will be replaced by Google account data)
  const userProfile = {
    name: "Test Mail",
    email: "testmail@gmail.com",
    profilePic: "../../assets/images/flixora.jpg", // Placeholder image
  };

  const settingsOptions = [
    { id: 'settings', name: 'Settings', icon: 'settings' },
    { id: 'developers', name: 'Developers', icon: 'code' },
    { id: 'credits', name: 'Credits', icon: 'award' },
    { id: 'version', name: 'App Version', icon: 'info' },
  ];

  const handleSettingPress = (id: string) => {
    console.log(`Option pressed: ${id}`);
    // Implement navigation or action for each option
  };

  const handleAccountPress = () => {
    setShowAccountDetails(true);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Implement logout logic here
    setShowAccountDetails(false);
  };

  return (
    <View className="flex-1 bg-slate-950 p-4 pt-16">
      {/* Profile Card */}
      <TouchableOpacity
        className="bg-neutral-800 rounded-lg p-4 flex-row items-center mb-6"
        onPress={handleAccountPress}
      >
        <Image
          source={{ uri: userProfile.profilePic }}
          className="w-20 h-20 rounded-full mr-4 border-2 border-white"
        />
        <View>
          <Text className="text-white text-xl font-bold">{userProfile.name}</Text>
          <Text className="text-gray-400 text-base">{userProfile.email}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#808080" className="ml-auto" />
      </TouchableOpacity>

      {/* Account Details Modal (Simplified) */}
      {showAccountDetails && (
        <View className="absolute inset-0 bg-slate-950 z-10 p-4 pt-16">
          <TouchableOpacity onPress={() => setShowAccountDetails(false)} className="mb-6">
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-bold mb-6">Account Details</Text>
          <View className="bg-neutral-800 rounded-lg p-4 mb-4">
            <Text className="text-white text-lg mb-2">Name: {userProfile.name}</Text>
            <Text className="text-white text-lg">Email: {userProfile.email}</Text>
          </View>
          <TouchableOpacity
            className="bg-white p-4 rounded-lg items-center"
            onPress={handleLogout}
          >
            <Text className="text-black text-lg font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      )}

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