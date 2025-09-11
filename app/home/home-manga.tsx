import { Link } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getPopularManga, getRecentlyAddedManga, getTrendingManga } from '../../utils/mangaApi';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

// Simplified Manga type based on MangaDex API
export interface Manga {
  id: string;
  attributes: {
    title: {
      en: string;
    };
    description: {
      en: string;
    };
    tags: {
      id: string;
      attributes: {
        name: {
          en: string;
        };
      };
    }[];
    year: number;
    status: string;
  };
  relationships: {
    id: string;
    type: string;
    attributes?: {
      fileName: string;
      name?: string;
    };
  }[];
}


export default function HomeManga() {
  const [trendingManga, setTrendingManga] = useState<Manga[]>([]);
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [recentlyAddedManga, setRecentlyAddedManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Manga>>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await getTrendingManga();
        setTrendingManga(trending);

        const popular = await getPopularManga();
        setPopularManga(popular);

        const recentlyAdded = await getRecentlyAddedManga();
        setRecentlyAddedManga(recentlyAdded);
      } catch (error) {
        console.error("HomeManga: Error fetching home screen data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (trendingManga.length > 0) {
      const interval = setInterval(() => {
        if (flatListRef.current) {
          const nextIndex = (activeIndex + 1) % trendingManga.length;
          const offset = nextIndex * Dimensions.get('window').width;
          flatListRef.current.scrollToOffset({ offset, animated: true });
          setActiveIndex(nextIndex);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeIndex, trendingManga.length]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const renderMangaItem = ({ item }: { item: Manga }) => {
    const coverArt = item.relationships.find(rel => rel.type === 'cover_art');
    const coverUrl = coverArt ? `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes?.fileName}` : 'https://via.placeholder.com/150';

    return (
      <Link href={`/manga/${item.id}`} asChild>
        <TouchableOpacity style={styles.movieItem}>
          <View style={styles.posterContainer}>
            <Image
              source={{ uri: coverUrl }}
              style={styles.poster}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradient}
            />
          </View>
          <View style={styles.movieTextContainer}>
            <Text style={styles.movieTitle} numberOfLines={2}>{item.attributes.title.en}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  const renderTrendingItem = ({ item }: { item: Manga }) => {
    const coverArt = item.relationships.find(rel => rel.type === 'cover_art');
    const coverUrl = coverArt ? `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes?.fileName}` : 'https://via.placeholder.com/150';

    return (
      <Link href={`/manga/${item.id}`} asChild>
        <TouchableOpacity style={styles.trendingItem}>
          <View style={styles.posterContainer}>
            <Image
              source={{ uri: coverUrl }}
              style={styles.trendingBackdrop}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.gradient}
            />
          </View>
          <View style={styles.trendingOverlay}>
            <Text style={styles.trendingTitle} numberOfLines={2}>{item.attributes.title.en}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titleHeader}>Trending Manga</Text>
            <FlatList
              ref={flatListRef}
              data={trendingManga}
              renderItem={renderTrendingItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={Dimensions.get('window').width}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 0 }}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            />
            <View style={styles.pagerContainer}>
              {trendingManga.map((_, index) => (
                <View
                  key={index}
                  style={[styles.pagerDot, { backgroundColor: activeIndex === index ? '#FFD700' : '#888' }]}
                />
              ))}
            </View>

            {popularManga.length > 0 && (
              <View style={styles.genreSection}>
                <Text style={styles.sectionHeader}>Popular Manga</Text>
                <FlatList
                  data={popularManga}
                  renderItem={renderMangaItem}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.genreMovieListContainer}
                />
              </View>
            )}

            {recentlyAddedManga.length > 0 && (
              <View style={styles.genreSection}>
                <Text style={styles.sectionHeader}>Recently Added</Text>
                <FlatList
                  data={recentlyAddedManga}
                  renderItem={renderMangaItem}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.genreMovieListContainer}
                />
              </View>
            )}
          </>
        }
        data={[]}
        renderItem={null}
        keyExtractor={(item, index) => index.toString()}
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
  sectionHeader: { // Added for consistency
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  trendingItem: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  trendingBackdrop: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    height: '100%',
  },
  trendingTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 12,
  },
  pagerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pagerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  movieItem: {
    width: 160,
    height: 240,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    position: 'relative',
  },
  posterContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  movieTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  genreMovieListContainer: {
    paddingLeft: 5,
    paddingRight: 15,
  },
});