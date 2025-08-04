import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useMode } from '../context/ModeContext';

const modes = [
  { id: 'movies', name: 'Movies', image: require('../assets/images/react-logo.png') },
  { id: 'tv', name: 'TV Shows', image: require('../assets/images/react-logo.png') },
  { id: 'anime', name: 'Anime', image: require('../assets/images/anime/anime-1.jpg') },
  { id: 'manga', name: 'Manga', image: require('../assets/images/anime/anime-2.jpg') },
];

export default function ModeSwitcher() {
  const { mode: activeMode, setMode } = useMode();

  const handleModeSelect = (mode) => {
    setMode(mode);
  };

  return (
    <View className="mb-6">
      <Text className="text-white text-xl font-bold mb-4 px-4">Switch Mode</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4"
      >
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            className="items-center mr-4"
            onPress={() => handleModeSelect(mode.id)}
          >
            <View className={`w-24 h-24 rounded-full border-2 ${activeMode === mode.id ? 'border-blue-500' : 'border-transparent'} justify-center items-center`}>
              <Image source={mode.image} className="w-20 h-20 rounded-full" />
            </View>
            <Text className={`text-white text-lg mt-2 ${activeMode === mode.id ? 'font-bold' : ''}`}>{mode.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
