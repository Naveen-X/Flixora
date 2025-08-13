import { Text, View } from "react-native";

export default function Credits() {
  return (
    <View className="flex-1 bg-slate-950 justify-center items-center">
      <Text className="text-white text-2xl">Credits</Text>
      <Text className="text-white text-lg mt-4">Powered by Expo and React Native</Text>
    </View>
  );
}
