import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";

export default function Onboarding() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-950 p-4">
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-5xl font-bold mb-2">Flixora</Text>
        <Text className="text-gray-400 text-lg text-center px-8">
          Your ultimate destination for endless entertainment. Discover, watch, and enjoy!
        </Text>
      </View>
      <Link href="/(auth)/mode-selector" asChild>
        <TouchableOpacity className="w-full bg-red-600 p-4 rounded-lg items-center mb-8">
          <Text className="text-white text-lg font-semibold">Continue</Text>
        </TouchableOpacity>
      </Link>
      <StatusBar style="auto" />
    </View>
  );
}
