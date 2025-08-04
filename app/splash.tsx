import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function SplashScreen() {
  const text = "Flixora";
  const animatedValues = useRef(
    text.split("").map(() => new Animated.Value(0))
  ).current;
  const containerAnim = useRef(new Animated.Value(1)).current; // For exit animation

  useEffect(() => {
    const animations = animatedValues.map((value) => {
      return Animated.timing(value, {
        toValue: 1,
        duration: 200, // Faster entrance
        useNativeDriver: true,
      });
    });

    Animated.stagger(100, animations).start(() => { // Faster stagger
      setTimeout(() => {
        Animated.timing(containerAnim, {
          toValue: 0,
          duration: 200, // Faster exit
          useNativeDriver: true,
        }).start();
      }, 200); // Shorter pause
    });
  }, [animatedValues, containerAnim]);

  const containerStyle = {
    opacity: containerAnim,
    transform: [
      {
        scale: containerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [2.5, 1], // Zoom in to 2x size on exit
        }),
      },
    ],
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#020617",
      }}
    >
      <Animated.View style={[{ flexDirection: "row" }, containerStyle]}>
        {text.split("").map((letter, index) => {
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
      </Animated.View>
    </View>
  );
}