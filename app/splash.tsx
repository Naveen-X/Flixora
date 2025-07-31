import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function SplashScreen() {
  const text = "Flixora";
  const animatedValues = useRef(text.split('').map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animatedValues.map((value) => {
      return Animated.timing(value, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      });
    });

    Animated.stagger(150, animations).start();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#020617" }}>
      <View style={{ flexDirection: 'row' }}>
        {text.split('').map((letter, index) => {
          const scale = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          });
          const opacity = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          return (
            <Animated.Text
              key={index}
              style={{
                color: "white",
                fontSize: 64,
                fontWeight: "bold",
                opacity,
                transform: [{ scale }],
              }}
            >
              {letter}
            </Animated.Text>
          );
        })}
      </View>
    </View>
  );
}