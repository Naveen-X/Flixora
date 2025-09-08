import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getCache, setCache } from '../..//utils/cache';
import { getTVShowGenres, getTVShowsByGenre, getTrendingTVShows } from '../../utils/tmdbApi';

const { width } = Dimensions.get('window');



interface Genre {
  id: number;
  name: string;
}

interface GenreSection {
  genre: Genre;
  shows: TVShow[];
}

export default function HomeTV() {
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [genreSections, setGenreSections] = useState<GenreSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<TVShow>>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = getCache();
        if (cachedData?.trendingTVShows?.length > 0 && cachedData?.tvGenreSections?.length > 0) {
          setTrendingTVShows(cachedData.trendingTVShows);
          setGenreSections(cachedData.tvGenreSections);
          setLoading(false);
          return;
        }

        const trending = await getTrendingTVShows();
        setTrendingTVShows(trending);

        const genres = await getTVShowGenres();
        const sections: GenreSection[] = [];
        for (const genre of genres) {
          const shows = await getTVShowsByGenre(genre.id);
          if (shows.length > 0) {
            sections.push({ genre, shows });
          }
        }
        setGenreSections(sections);
        setCache({ trendingTVShows: trending, tvGenreSections: sections });
      } catch (error) {
        console.error("HomeTV: Error fetching home screen data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (trendingTVShows.length > 0) {
      const interval = setInterval(() => {
        if (flatListRef.current) {
          const nextIndex = (activeIndex + 1) % trendingTVShows.length;
          const offset = nextIndex * width;
          flatListRef.current.scrollToOffset({ offset, animated: true });
          setActiveIndex(nextIndex);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeIndex, trendingTVShows.length]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const renderShowItem = ({ item }: { item: TVShow }) => (
    <Link href={`/tv/${item.id}`} asChild>
      <TouchableOpacity style={styles.showItem}>
        <View style={styles.posterContainer}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradient}
            />
          </View>
        <View style={styles.showTextContainer}>
          <Text style={styles.showTitle} numberOfLines={2}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" style={styles.starIcon} />
            <Text style={styles.ratingText}>{item.vote_average.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  const renderTrendingItem = ({ item }: { item: TVShow }) => (
    <Link href={`/tv/${item.id}`} asChild>
      <TouchableOpacity style={styles.trendingItem}>
        <View style={styles.posterContainer}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w780${item.backdrop_path}` }}
              style={styles.trendingBackdrop}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.gradient}
            />
          </View>
        <View style={styles.trendingOverlay}>
          <Text style={styles.trendingTitle} numberOfLines={2}>{item.name}</Text>
        </View>
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
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>TV Shows</Text>
            </View>
            
            <FlatList
              ref={flatListRef}
              data={trendingTVShows}
              renderItem={renderTrendingItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width} // Item width
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 0 }}
              initialNumToRender={3} // Optimize rendering
              windowSize={9} // Optimize rendering
              maxToRenderPerBatch={5} // Optimize rendering
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            />
          <View style={styles.pagerContainer}>
              {trendingTVShows.map((_, index) => (
                <View
                  key={index}
                  style={[styles.pagerDot, { backgroundColor: activeIndex === index ? '#FFD700' : '#888' }]}
                />
              ))}
            </View>
          </>
        }
        data={genreSections}
        renderItem={({ item }) => (
          <View style={styles.genreSection}>
            <Text style={styles.genreHeader}>{item.genre.name}</Text>
            <FlatList
              data={item.shows}
              renderItem={renderShowItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.genreShowListContainer}
              initialNumToRender={7} // Optimize rendering
              windowSize={11} // Optimize rendering
              maxToRenderPerBatch={7} // Optimize rendering
            />
          </View>
        )}
        keyExtractor={(item) => item.genre.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  
  headerContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
    textAlign:'center',
    marginBottom: 10,
  },
  genreHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  // Trending TVShows Styles
  trendingListContainer: {
    paddingHorizontal: 15,
  },
  trendingItem: {
    width: width,
    height: width * (9 / 16),
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
  // Genre Sections Styles
  genreSection: {
    marginBottom: 20,
  },
  genreShowListContainer: {
    paddingHorizontal: 15,
  },
  showItem: {
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
    position: 'relative', // Needed for absolute positioning of children
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
  showTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  showTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  starIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
}
