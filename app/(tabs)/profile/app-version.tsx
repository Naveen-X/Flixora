import { Text, View, TouchableOpacity, Alert } from "react-native";
import * as Application from 'expo-application';
import { useEffect, useState } from 'react';
import { Feather } from "@expo/vector-icons";

export default function AppVersion() {
  const [appVersion, setAppVersion] = useState('Loading...');
  const [buildVersion, setBuildVersion] = useState('Loading...');

  useEffect(() => {
    const getVersionInfo = async () => {
      const version = Application.nativeApplicationVersion || 'Unknown';
      const build = Application.nativeBuildVersion || 'Unknown';
      setAppVersion(version);
      setBuildVersion(build);
    };
    getVersionInfo();
  }, []);

  const handleCheckForUpdates = () => {
    Alert.alert("Check for Updates", "Checking for new updates... (Feature not fully implemented)");
    // In a real app, you would call an API to check for updates
  };

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white text-3xl font-bold mb-6">App Information</Text>

      <View className="bg-neutral-800 rounded-lg p-4 mb-4">
        <View className="flex-row items-center mb-2">
          <Feather name="info" size={20} color="#FFFFFF" className="mr-3" />
          <Text className="text-white text-lg">Version: {appVersion}</Text>
        </View>
        <View className="flex-row items-center">
          <Feather name="hash" size={20} color="#FFFFFF" className="mr-3" />
          <Text className="text-white text-lg">Build: {buildVersion}</Text>
        </View>
      </View>

      <TouchableOpacity
        className="flex-row items-center bg-blue-600 rounded-lg p-4"
        onPress={handleCheckForUpdates}
      >
        <Feather name="refresh-cw" size={22} color="#FFFFFF" className="mr-3" />
        <Text className="text-white text-lg flex-1">Check for Updates</Text>
        <Feather name="chevron-right" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add legal links or other app info here */}
    </View>
  );
}
