import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function MoviePlayerScreen() {
  const { id } = useLocalSearchParams();
  const embedUrl = `https://vidsrc.xyz/embed/movie/${id}`;

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    };
    lockOrientation();

    return () => {
      const unlockOrientation = async () => {
        await ScreenOrientation.unlockAsync();
      };
      unlockOrientation();
    };
  }, []);

  return (
    <View style={styles.container}>
      <WebView
  source={{ uri: embedUrl }}
  style={{ flex: 1, backgroundColor: "black" }}
  allowsFullscreenVideo
  javaScriptEnabled
  domStorageEnabled
  startInLoadingState
  onShouldStartLoadWithRequest={(req) => {
    if (req.url.startsWith("https://vidsrc.xyz") || req.url.startsWith("https://vidsrc.me")) {
      return true;
    }
    return false;
  }}
  injectedJavaScript={`
    // Kill popups
    window.open = () => null;

    // Block links
    const killLinks = () => {
      document.querySelectorAll("a").forEach(el => {
        el.removeAttribute("target");
        el.href = "javascript:void(0)";
        el.onclick = (e) => { e.preventDefault(); return false; };
      });
    };
    killLinks();

    // Observer to keep cleaning ads
    const observer = new MutationObserver(killLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    // 🚫 Trap ALL clicks except <video>
    document.addEventListener("click", (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag !== "video" && tag !== "button") {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
    }, true);

    true;
  `}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  videoPlayer: {
    flex: 1,
  },
});
