import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { getTrendingAnime, Anime } from '../../utils/anilistApi';

export default function HomeAnime() {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await getTrendingAnime();
        setTrendingAnime(trending);
      } catch (error) {
        console.error("HomeAnime: Error fetching home screen data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderAnimeItem = ({ item }: { item: Anime }) => (
    <Link href={`/anime/${item.id}`} asChild>
      <TouchableOpacity style={styles.movieItem}>
        <Image
          source={{ uri: item.coverImage.large }}
          style={styles.poster}
        />
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title.english || item.title.romaji}</Text>
      </TouchableOpacity>
    </Link>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titleHeader}>Trending Anime</Text>
          </>
        }
        data={trendingAnime}
        renderItem={renderAnimeItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  titleHeader: {
    fontSize: 24,
    fontWeight:'bold',
    color: '#fff',
    marginLeft: 15,
    marginTop: 20,
    textAlign:'center',
    marginBottom: 10,
  },
  movieItem: {
    flex: 1,
    margin: 5,
    maxWidth: '48%',
    alignItems: 'center',
  },
  poster: {
    width: 180,
    height: 250,
    borderRadius: 10,
  },
  movieTitle: {
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
    width: 150,
  },
});