import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useMode } from "../../context/ModeContext";

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [lastSearchedText, setLastSearchedText] = useState('');
  const { mode } = useMode();

  const handleSearch = () => {
    console.log('Searching for:', searchText, 'in mode:', mode);
    setLastSearchedText(searchText);
    // Implement your search logic here, using the 'mode' variable
  };

  return (
    <View className="flex-1 bg-slate-950 p-4 pt-16">
      <View className="flex-row items-center bg-neutral-800 rounded-full px-5 py-2.5 mb-4 border border-neutral-700">
        <Feather name="search" size={20} color="white" className="mr-3" />
        <TextInput
          className="flex-1 text-white text-lg"
          placeholder={`Search for ${mode}...`}
          placeholderTextColor="#A0A0A0" // A slightly lighter gray for placeholder
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} className="ml-3">
            <Feather name="x-circle" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      {/* Search results or suggestions can go here */}
      <View className="flex-1 justify-center items-center">
        {lastSearchedText ? (
          <Text className="text-gray-400 text-lg">Showing results for "{lastSearchedText}"</Text>
        ) : (
          <Text className="text-gray-400 text-lg">Start typing to search</Text>
        )}
      </View>
    </View>
  );
}