import React, { useState } from 'react';
import { Text, View, Switch, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear the application cache?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", onPress: () => console.log("Cache Cleared!") }, // Placeholder for cache clearing logic
      ]
    );
  };

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white text-3xl font-bold mb-6">Settings</Text>

      {/* Notifications Setting */}
      <View className="flex-row items-center justify-between bg-neutral-800 rounded-lg p-4 mb-4">
        <View className="flex-row items-center">
          <Feather name="bell" size={22} color="#FFFFFF" className="mr-3" />
          <Text className="text-white text-lg">Notifications</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
          value={notificationsEnabled}
        />
      </View>

      {/* Clear Cache Button */}
      <TouchableOpacity
        className="flex-row items-center bg-neutral-800 rounded-lg p-4 mb-4"
        onPress={handleClearCache}
      >
        <Feather name="trash-2" size={22} color="#FFFFFF" className="mr-3" />
        <Text className="text-white text-lg flex-1">Clear Cache</Text>
        <Feather name="chevron-right" size={20} color="#808080" />
      </TouchableOpacity>

      {/* Add more settings options here */}
    </View>
  );
}
