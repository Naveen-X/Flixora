import { ActivityIndicator, View } from "react-native";
import ModeRenderer from "../../components/ModeRenderer";
import { useMode } from "../../context/ModeContext";

export default function Index() {
  const { mode } = useMode();

  if (!mode) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-900">
      <ModeRenderer />
    </View>
  );
}
