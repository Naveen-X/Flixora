import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Alert, BackHandler, View } from "react-native";

export default function TabLayout() {
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Exit App", "Do you want to exit the app?", [
        {
          text: "No",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF", // White color
        tabBarInactiveTintColor: "#808080", // Gray
        tabBarStyle: {
          backgroundColor: "rgba(20, 20, 20, 0.9)", // Dark translucent background
          borderTopWidth: 0.5,
          borderTopColor: "rgba(128, 128, 128, 0.3)", // Subtle gray border
          elevation: 0,
          height: 75, // Increased height for more space
          paddingBottom: 20, // Significant padding to push icons up
          paddingTop: 10, // Balance with top padding
        },
        tabBarLabelStyle: { display: "none" }, // Hide labels
      }}
      safeAreaInsets={{ bottom: 0 }} // Explicitly set bottom inset to 0
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "", // Empty title for no label
          tabBarIcon: ({ color, focused }) => (
            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <Feather name="home" size={focused ? 32 : 28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <Feather name="search" size={focused ? 32 : 28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <Feather name="heart" size={focused ? 32 : 28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <Feather name="user" size={focused ? 32 : 28} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}