
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getMangaDetails } from '../../utils/mangaApi';
import { Book, Star } from 'react-native-feather';
import { LinearGradient } from 'expo-linear-gradient';
import { Manga } from '../home/home-manga';

export default function MangaDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const mangaDetails = await getMangaDetails(id as string);
        setManga(mangaDetails);
      } catch (error) {
        console.error("Error fetching manga details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!manga) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Manga not found.</Text>
      </View>
    );
  }

  const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
  const coverUrl = coverArt ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes?.fileName}` : 'https://via.placeholder.com/300';

  const author = manga.relationships.find(rel => rel.type === 'author');
  const artist = manga.relationships.find(rel => rel.type === 'artist');

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: coverUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
        </View>

        <View style={styles.detailsContainer}>
            <Image source={{uri: coverUrl}} style={styles.coverImage} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{manga.attributes.title.en}</Text>
            </View>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoValue}>{manga.attributes.description.en.replace(/<br>/g, '\n')}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{manga.attributes.status}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Year</Text>
            <Text style={styles.infoValue}>{manga.attributes.year}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Author</Text>
            <Text style={styles.infoValue}>{author ? author.attributes.name : 'N/A'}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Artist</Text>
            <Text style={styles.infoValue}>{artist ? artist.attributes.name : 'N/A'}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Tags</Text>
            <Text style={styles.infoValue}>{manga.attributes.tags.map(tag => tag.attributes.name.en).join(', ')}</Text>
        </View>

      </ScrollView>

      <View style={styles.playButtonContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.push(`/reader/manga?id=${manga.id}`)}
        >
          <Book color="white" width={20} height={20} style={styles.playIcon} />
          <Text style={styles.playButtonText}>Read</Text>
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
    titleContainer: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 15 },
    title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    infoSection: { paddingHorizontal: 15, marginTop: 20 },
    infoLabel: { color: '#9ca3af', fontSize: 16, marginBottom: 5 },
    infoValue: { color: 'white', fontSize: 16 },
    playButtonContainer: { padding: 15, borderTopWidth: 1, borderColor: '#1f2937', backgroundColor: 'black' },
    playButton: { backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    playIcon: { marginRight: 10 },
    playButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    scrollContentContainer: { paddingBottom: 100 }, 
});
