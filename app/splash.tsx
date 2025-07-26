import { ResizeMode, Video } from "expo-av";
import { View } from "react-native";

export default function SplashScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#020617" }}>
      <Video
        source={require("../assets/splash.mp4")}
        style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
        shouldPlay
        isLooping={false}
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );
}