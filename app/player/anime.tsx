
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import MoviePlayer from "../../components/MoviePlayer";
import { getAnimeDetails, Anime } from "../../utils/anilistApi";

export default function AnimePlayerPage() {
  const router = useRouter();
  const { id, episode, dub } = useLocalSearchParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState(Number(episode) || 1);
  const [isDub, setIsDub] = useState(dub === 'true');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const animeDetails = await getAnimeDetails(Number(id));
        setAnime(animeDetails);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!anime) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Anime not found.</Text>
      </View>
    );
  }

  const episodes = Array.from({ length: anime.episodes }, (_, i) => i + 1);

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={() => (
        <View className="flex-1 bg-black">
          <View className="w-full aspect-video bg-gray-800">
            <MoviePlayer
              videoId={id as string}
              type="anime"
              episodeNumber={selectedEpisode}
              dub={isDub}
              onClose={() => router.back()}
            />
          </View>

          <View style={styles.dubSubSelector}>
              <TouchableOpacity style={[styles.dubSubButton, !isDub && styles.dubSubButtonActive]} onPress={() => setIsDub(false)}>
                  <Text style={styles.dubSubButtonText}>Sub</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dubSubButton, isDub && styles.dubSubButtonActive]} onPress={() => setIsDub(true)}>
                  <Text style={styles.dubSubButtonText}>Dub</Text>
              </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Episodes</Text>
              <FlatList
                  data={episodes}
                  renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={[styles.episodeButton, selectedEpisode === item && styles.episodeButtonActive]} 
                        onPress={() => setSelectedEpisode(item)}
                      >
                          <Text style={styles.episodeText}>Episode {item}</Text>
                      </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
              />
          </View>
        </View>
      )}
      renderItem={null}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
    errorText: { color: 'white', fontSize: 18 },
    infoSection: { paddingHorizontal: 15, marginTop: 20 },
    infoLabel: { color: '#9ca3af', fontSize: 16, marginBottom: 5 },
    dubSubSelector: { flexDirection: 'row', justifyContent: 'center', marginVertical: 20 },
    dubSubButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginHorizontal: 10, backgroundColor: '#333' },
    dubSubButtonActive: { backgroundColor: '#3b82f6' },
    dubSubButtonText: { color: 'white', fontWeight: 'bold' },
    episodeButton: { backgroundColor: '#333', padding: 15, borderRadius: 10, marginRight: 10 },
    episodeButtonActive: { backgroundColor: '#3b82f6' },
    episodeText: { color: 'white' },
});
