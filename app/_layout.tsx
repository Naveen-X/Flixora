import { AuthProvider, useAuth } from "../context/AuthContest";
import { ModeProvider } from "../context/ModeContext";
import { Slot, useRouter } from "expo-router";
import "./globals.css";
import { useEffect, useState } from "react";
import SplashScreen from "./splash";

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) { // Only run routing logic after auth status is loaded
      if (isLoggedIn) {
        router.replace("/(auth)/mode-selector");
      } else {
        router.replace("/(auth)/onboarding");
      }
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return null; // Or a loading indicator while auth status is loading
  }

  return <Slot />;
}

export default function RootLayout() {
  const [splashComplete, setSplashComplete] = useState(false);
  const { isLoading } = useAuth(); // Get isLoading from AuthContext

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashComplete(true);
    }, 4000); // Simulate splash screen duration

    return () => clearTimeout(timer);
  }, []);

  // Show splash screen until both splash animation is complete AND auth status is loaded
  if (!splashComplete || isLoading) {
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
