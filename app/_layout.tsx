import { useRouter, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ModeProvider, useMode } from "../context/ModeContext";
import "./globals.css";
import SplashScreen from "./splash";
import { WishlistProvider } from "../context/WishlistContext";
import Toast from 'react-native-toast-message';

function RootLayoutNav() {
  const { mode } = useMode();
  const router = useRouter();
  const [isSplashAnimationFinished,setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashAnimationFinished(true);
    }, 1250); // Corresponds to the new splash screen animation duration
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSplashAnimationFinished) {
      const navTimer = setTimeout(() => {
        if (mode) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/mode-selector");
        }
      }, 0);
      return () => clearTimeout(navTimer);
    }
  }, [isSplashAnimationFinished, mode, router]);

  if (!isSplashAnimationFinished) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar hidden={true} />
      <SafeAreaView style={{ flex: 1 }} className="bg-black">
        <Stack>
          <Stack.Screen name="(auth)/mode-selector" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="movies" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="movies/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="movies/play/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="player" options={{ headerShown: false }} />
          <Stack.Screen name="player/movie" options={{ headerShown: false }} />
          <Stack.Screen name="player/tv" options={{ headerShown: false }} />
          <Stack.Screen name="player/anime" options={{ headerShown: false }} />
          <Stack.Screen name="tv" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="tv/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="tv/play/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="anime" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="anime/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="manga" options={{ headerShown: false }} />
          <Stack.Screen name="manga/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="reader" options={{ headerShown: false }} />
          <Stack.Screen name="reader/manga" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </>
  );
}

export default function RootLayout() {
  return (
    <ModeProvider>
      <WishlistProvider>
        <RootLayoutNav />
        <Toast />
      </WishlistProvider>
    </ModeProvider>
  );
}