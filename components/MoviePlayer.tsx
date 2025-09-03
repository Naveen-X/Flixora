import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ImageBackground, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { WebView } from "react-native-webview";

export default function MoviePlayer({ videoId, type, seasonNumber, episodeNumber, onClose }) {
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [embedUrl, setEmbedUrl] = useState(""); // New state for embedUrl
  const backButtonTimeout = useRef(null);
  const webViewRef = useRef(null);

  useEffect(() => {
    // Construct the videasy embed URL
    let url = "";
    if (type === "movie") {
      url = `https://player.videasy.net/movie/${videoId}`;
    } else if (type === "tv" && seasonNumber && episodeNumber) {
      url = `https://player.videasy.net/tv/${videoId}/${seasonNumber}/${episodeNumber}`;
    } else if (type === "tv") {
      url = `https://player.videasy.net/tv/${videoId}`;
    }
    setEmbedUrl(url);
  }, [videoId, type, seasonNumber, episodeNumber]); // Re-run when videoId, type, seasonNumber, or episodeNumber changes

  useEffect(() => {
    return () => {
      if (backButtonTimeout.current) {
        clearTimeout(backButtonTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showControls && !canGoBack) {
      backButtonTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [showControls, canGoBack]);

  const handleBack = () => {
    if (canGoBack) {
      webViewRef.current.goBack();
    } else {
      onClose();
    }
  };

  const handleScreenPress = () => {
    setShowControls(true);
  };

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
  };

  // Remove posterUrl as movie prop is removed.
  // If you need a poster, you'll need to fetch it using videoId.

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.container}>
        
        {loading && (
          <ImageBackground
            // Removed source={{ uri: posterUrl }}
            style={styles.loadingContainer}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
            <ActivityIndicator size="large" color="white" />
          </ImageBackground>
        )}
        {embedUrl ? ( // Only render WebView if embedUrl is available
          <WebView
            ref={webViewRef}
            source={{ uri: embedUrl }}
            style={{ flex: 1, backgroundColor: "black" }}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            onLoadEnd={() => setLoading(false)}
            onShouldStartLoadWithRequest={(req) => {
              if (req.url.startsWith("https://player.videasy.net")) {
                return true;
              }
              return false;
            }}
            onNavigationStateChange={handleNavigationStateChange}
            
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  overview: {
    color: "white",
    fontSize: 12,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  videoPlayer: {
    flex: 1,
  },
});
