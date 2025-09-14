
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MoviePlayer from "../../components/MoviePlayer";
import { Anime, getAnimeDetails } from "../../utils/anilistApi";

export default function AnimePlayerPage() {
  const router = useRouter();
  const { id, episode, dub } = useLocalSearchParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState(Number(episode) || 1);
  const [isDub, setIsDub] = useState(dub === 'true');
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 10; // You can adjust this number

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
              {episodes.length > 0 ? (
                <>
                  <FlatList
                      data={episodes.slice((currentPage - 1) * episodesPerPage, currentPage * episodesPerPage)}
                      renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[styles.episodeButton, selectedEpisode === item && styles.episodeButtonActive]}
                            onPress={() => setSelectedEpisode(item)}
                          >
                              <Text style={styles.episodeText}>Episode {item}</Text>
                          </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item.toString()}
                      numColumns={3} // Display in columns for better layout
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.episodeListContainer} // Add style for padding
                  />
                  {/* Pagination Controls */}
                  <View style={styles.paginationContainer}>
                    <TouchableOpacity
                      style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                      onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <Text style={styles.paginationButtonText}>Previous</Text>
                    </TouchableOpacity>
                    <Text style={styles.paginationText}>{currentPage} / {Math.ceil(episodes.length / episodesPerPage)}</Text>
                    <TouchableOpacity
                      style={[styles.paginationButton, currentPage * episodesPerPage >= episodes.length && styles.paginationButtonDisabled]}
                      onPress={() => setCurrentPage(prev => prev + 1)}
                      disabled={currentPage * episodesPerPage >= episodes.length}
                    >
                      <Text style={styles.paginationButtonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.errorText}>No episodes found.</Text>
              )}
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
    episodeListContainer: { paddingBottom: 20 },
    paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingHorizontal: 15 },
    paginationButton: { backgroundColor: '#3b82f6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
    paginationButtonDisabled: { backgroundColor: '#333' },
    paginationButtonText: { color: 'white', fontWeight: 'bold' },
    paginationText: { color: 'white', fontSize: 16 },
});