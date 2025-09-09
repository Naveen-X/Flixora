import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { getAnimeDetails, Anime } from '../../utils/anilistApi';
import { Play, Star } from 'react-native-feather';
import { LinearGradient } from 'expo-linear-gradient';

export default function AnimeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [dub, setDub] = useState(false);

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
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: anime.bannerImage || anime.coverImage.extraLarge }}
            style={styles.poster}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
        </View>

        <View style={styles.detailsContainer}>
            <Image source={{uri: anime.coverImage.large}} style={styles.coverImage} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{anime.title.english || anime.title.romaji}</Text>
                <Text style={styles.subtitleText}>{anime.title.native}</Text>
            </View>
        </View>

        <View style={styles.ratingContainer}>
            <Star color="white" width={16} height={16} fill="white" />
            <Text style={styles.ratingText}>{anime.averageScore ? anime.averageScore / 10 : 'N/A'}/10</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Genres</Text>
            <Text style={styles.infoValue}>{anime.genres.join(', ')}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{anime.status}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Episodes</Text>
            <Text style={styles.infoValue}>{anime.episodes}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoValue}>{anime.description.replace(/<br>/g, '\n')}</Text>
        </View>

      </ScrollView>

      <View style={styles.playButtonContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.push(`/player/anime?id=${anime.id}`)}
        >
          <Play color="white" width={20} height={20} style={styles.playIcon} />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
    errorText: { color: 'white', fontSize: 18 },
    posterContainer: { position: 'relative' },
    poster: { width: '100%', height: 300 },
    gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' },
    detailsContainer: { flexDirection: 'row', paddingHorizontal: 15, marginTop: -100 },
    coverImage: { width: 120, height: 180, borderRadius: 10, marginRight: 15 },
    titleContainer: { flex: 1, justifyContent: 'flex-end' },
    title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    subtitleText: { color: '#9ca3af', fontSize: 14 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 12 },
    ratingText: { color: 'white', fontWeight: 'bold', fontSize: 14, marginLeft: 4 },
    infoSection: { paddingHorizontal: 15, marginTop: 20 },
    infoLabel: { color: '#9ca3af', fontSize: 16, marginBottom: 5 },
    infoValue: { color: 'white', fontSize: 16 },
    playButtonContainer: { padding: 15, borderTopWidth: 1, borderColor: '#1f2937', backgroundColor: 'black' },
    playButton: { backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    playIcon: { marginRight: 10 },
    playButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});