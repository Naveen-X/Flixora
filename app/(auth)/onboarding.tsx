import { useAuth } from "../../context/AuthContest";

import { Text, TouchableOpacity, View } from "react-native";

export default function Onboarding() {
  const { setIsLoggedIn } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-5xl font-bold mb-2">Flixora</Text>
        <Text className="text-gray-400 text-lg text-center px-8">
          Your ultimate destination for endless entertainment. Discover, watch, and enjoy!
        </Text>
      </View>
      <TouchableOpacity
        className="w-full bg-white p-4 rounded-lg items-center mb-8"
        onPress={() => setIsLoggedIn(true)}
      >
        <Text className="text-black text-lg font-semibold">Continue</Text>
      </TouchableOpacity>
      
    </View>
  );
}
