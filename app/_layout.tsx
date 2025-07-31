import { AuthProvider, useAuth } from "../context/AuthContest";
import { ModeProvider, useMode } from "../context/ModeContext";
import { Slot, useRouter } from "expo-router";
import "./globals.css";
import { useEffect, useState } from "react";
import SplashScreen from "./splash";

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth();
  const { mode } = useMode();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      if (mode) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/mode-selector");
      }
    } else {
      router.replace("/(auth)/onboarding");
    }
  }, [isLoggedIn, mode, router]);

  return <Slot />;
}

export default function RootLayout() {
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashComplete(true);
    }, 2500); // Match splash animation duration

    return () => clearTimeout(timer);
  }, []);

  // Show splash screen until splash animation is complete
  if (!splashComplete) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <ModeProvider>
        <RootLayoutNav />
      </ModeProvider>
    </AuthProvider>
  );
}
