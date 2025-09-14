import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Book, Film, Monitor, Tv } from 'react-native-feather';
import { useMode } from '../context/ModeContext';

const modes = [
  { id: 'movies', name: 'Movies', icon: Film },
  { id: 'tv', name: 'TV Shows', icon: Tv },
  { id: 'anime', name: 'Anime', icon: Monitor },
  { id: 'manga', name: 'Manga', icon: Book },
];

function ModeSwitcher() {
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
        {modes
          .filter((mode) => mode.id !== activeMode) // Filter out the active mode
          .map((mode) => (
            <TouchableOpacity
              key={mode.id}
              className="items-center mr-4"
              onPress={() => handleModeSelect(mode.id)}
            >
              <View className={`w-24 h-24 rounded-lg border-2 border-gray-700 justify-center items-center`}>
                                {React.createElement(mode.icon, { color: "white", width: 48, height: 48 })}
              </View>
              <Text className={`text-white text-xs mt-2 ${activeMode === mode.id ? 'font-bold' : ''}`}>{mode.name}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}

export default React.memo(ModeSwitcher);
