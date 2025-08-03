import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContest";
import { ModeProvider, useMode } from "../context/ModeContext";
import "./globals.css";
import SplashScreen from "./splash";

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth();
  const { mode } = useMode();
  const router = useRouter();
  const [isSplashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setSplashAnimationFinished(true);
      }, 1250); // Corresponds to the new splash screen animation duration
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSplashAnimationFinished) {
      const navTimer = setTimeout(() => {
        if (isLoggedIn) {
          if (mode) {
            router.replace("/(tabs)");
          } else {
            router.replace("/(auth)/mode-selector");
          }
        } else {
          router.replace("/(auth)/onboarding");
        }
      }, 0);
      return () => clearTimeout(navTimer);
    }
  }, [isSplashAnimationFinished, isLoggedIn, mode, router]);

  if (!isSplashAnimationFinished) {
    return <SplashScreen />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ModeProvider>
        <RootLayoutNav />
      </ModeProvider>
    </AuthProvider>
  );
}
