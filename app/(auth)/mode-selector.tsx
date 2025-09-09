import { Image, Text, TouchableOpacity, View } from "react-native";
import { useMode } from "../../context/ModeContext";

// Array of anime images
const animeImages = [
  require("../../assets/images/anime/anime-1.jpg"),
  require("../../assets/images/anime/anime-2.jpg"),
  require("../../assets/images/anime/anime-3.jpg"),
  require("../../assets/images/anime/anime-4.jpg"),
];

export default function ModeSelector() {
  const { setMode } = useMode();

  const handleModeSelect = (mode: string) => {
    setMode(mode);
  };

  const modes = [
    { name: "Anime", icon: "📺", value: "anime" },
    { name: "Manga", icon: "📚", value: "manga" },
    { name: "Webseries", icon: "🎬", value: "tv" },
    { name: "Movies", icon: "🍿", value: "movies" },
  ];

  // Randomly select one anime image
  const randomAnimeImage = animeImages[Math.floor(Math.random() * animeImages.length)];

  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      {/* <Text className="text-white text-4xl font-bold mb-10">Choose One</Text> */}
      <View className="flex-row flex-wrap justify-center w-full max-w-lg">
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.value}
            className="w-1/2 p-4 items-center"
            onPress={() => handleModeSelect(mode.value)}
          >
            <View className="w-32 h-32 bg-gray-800 rounded-md items-center justify-center mb-2">
              {mode.value === "anime" ? (
                <Image source={randomAnimeImage} className="w-full h-full rounded-md" />
              ) : (
                <Text className="text-6xl">{mode.icon}</Text>
              )}
            </View>
            <Text className="text-white text-xl font-semibold">{mode.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

