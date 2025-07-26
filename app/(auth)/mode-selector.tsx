import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useMode } from "../../context/ModeContext";

export default function ModeSelector() {
  const router = useRouter();
  const { setMode } = useMode();

  const handleModeSelect = (mode: string) => {
    setMode(mode);
    router.replace("/(tabs)");
  };

  const modes = [
    { name: "Anime", icon: "📺", value: "anime" },
    { name: "Manga", icon: "📚", value: "manga" },
    { name: "Webseries", icon: "🎬", value: "tv" },
    { name: "Movies", icon: "🍿", value: "movies" },
  ];

  return (
    <View className="flex-1 items-center justify-center bg-slate-950 p-4">
      <Text className="text-white text-4xl font-bold mb-10">Who's Watching?</Text>
      <View className="flex-row flex-wrap justify-center w-full max-w-lg">
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.value}
            className="w-1/2 p-4 items-center"
            onPress={() => handleModeSelect(mode.value)}
          >
            <View className="w-32 h-32 bg-gray-800 rounded-md items-center justify-center mb-2">
              <Text className="text-6xl">{mode.icon}</Text>
            </View>
            <Text className="text-white text-xl font-semibold">{mode.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

