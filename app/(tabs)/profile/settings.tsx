import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const [selectedProvider, setSelectedProvider] = useState('anilist'); // Default to Anilist

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const storedProvider = await AsyncStorage.getItem('anime_provider');
        if (storedProvider) {
          setSelectedProvider(storedProvider);
        }
      } catch (e) {
        console.error("Failed to load anime provider from AsyncStorage", e);
      }
    };
    loadProvider();
  }, []);

  const handleProviderChange = async (itemValue: string) => {
    setSelectedProvider(itemValue);
    try {
      await AsyncStorage.setItem('anime_provider', itemValue);
    } catch (e) {
      console.error("Failed to save anime provider to AsyncStorage", e);
    }
  };

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white text-3xl font-bold mb-6">Settings</Text>

      {/* Anime Provider Selection */}
      <View className="bg-neutral-800 rounded-lg p-4 mb-4">
        <Text className="text-white text-lg mb-2">Anime Provider</Text>
        <Picker
          selectedValue={selectedProvider}
          onValueChange={(itemValue) => handleProviderChange(itemValue)}
          style={{ color: 'white' }}
          dropdownIconColor="white"
        >
          <Picker.Item label="Anilist (Videasy)" value="anilist" />
        </Picker>
      </View>

      {/* Add more settings options here */}
    </View>
  );
}
