import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Alert, BackHandler, View } from "react-native";
import CustomTabBar from "../../components/CustomTabBar";

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
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF", // White color
        tabBarInactiveTintColor: "#808080", // Gray
        tabBarStyle: {
          backgroundColor: "transparent", // Make background transparent to show blur
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: { display: "none" }, // Hide labels
      }}
      // Removed safeAreaInsets={{ bottom: 0 }} to allow content to extend behind tab bar
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