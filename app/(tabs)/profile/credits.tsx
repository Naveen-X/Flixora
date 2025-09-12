import { Text, View, ScrollView, Linking, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Credits() {
  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView className="flex-1 bg-black p-4">
      <Text className="text-white text-3xl font-bold mb-6">Credits</Text>

      <View className="bg-neutral-800 rounded-lg p-4 mb-4">
        <Text className="text-white text-xl font-semibold mb-3">Core Technologies</Text>
        <Text className="text-gray-300 text-base mb-2">- Powered by Expo and React Native</Text>
        <Text className="text-gray-300 text-base mb-2">- Navigation with Expo Router</Text>
        <Text className="text-gray-300 text-base">- Styling with NativeWind (Tailwind CSS)</Text>
      </View>

      <View className="bg-neutral-800 rounded-lg p-4 mb-4">
        <Text className="text-white text-xl font-semibold mb-3">APIs & Data Sources</Text>
        <Text className="text-gray-300 text-base mb-2">- AniList API (for Anime & Manga data)</Text>
        <Text className="text-gray-300 text-base mb-2">- TMDB API (for Movie & TV show data)</Text>
        <Text className="text-gray-300 text-base">- MangaDex API (for Manga chapters)</Text>
      </View>

      <View className="bg-neutral-800 rounded-lg p-4 mb-4">
        <Text className="text-white text-xl font-semibold mb-3">Special Thanks</Text>
        <Text className="text-gray-300 text-base mb-2">- Open-source community for amazing tools and libraries.</Text>
        <Text className="text-gray-300 text-base">- All contributors and testers.</Text>
      </View>

      <TouchableOpacity
        className="flex-row items-center bg-blue-600 rounded-lg p-4 mb-4"
        onPress={() => handleLinkPress("https://expo.dev/")}
      >
        <Feather name="external-link" size={22} color="#FFFFFF" className="mr-3" />
        <Text className="text-white text-lg flex-1">Visit Expo Website</Text>
        <Feather name="chevron-right" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add more links or acknowledgements as needed */}
    </ScrollView>
  );
}
