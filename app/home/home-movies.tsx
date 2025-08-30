import { SharedElement } from 'react-navigation-shared-element';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { getTrendingMovies, getMovieGenres, getMoviesByGenre } from '../../utils/tmdbApi';
import { Link } from 'expo-router';
import { getCache, setCache } from '../../utils/cache';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

interface GenreSection {
  genre: Genre;
  movies: Movie[];
}

export default function HomeMovies() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [genreSections, setGenreSections] = useState<GenreSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Movie>>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = getCache();
        if (cachedData && cachedData.trendingMovies.length > 0 && cachedData.genreSections.length > 0) {
          setTrendingMovies(cachedData.trendingMovies);
          setGenreSections(cachedData.genreSections);
          setLoading(false);
          return;
        }

        const trending = await getTrendingMovies();
        setTrendingMovies(trending);

        const genres = await getMovieGenres();
        const sections: GenreSection[] = [];
        for (const genre of genres) {
          const movies = await getMoviesByGenre(genre.id);
          if (movies.length > 0) {
            sections.push({ genre, movies });
          }
        }
        setGenreSections(sections);
        setCache({ trendingMovies: trending, genreSections: sections });
      } catch (error) {
        console.error("HomeMovies: Error fetching home screen data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const interval = setInterval(() => {
        if (flatListRef.current) {
          const nextIndex = (activeIndex + 1) % trendingMovies.length;
          const offset = nextIndex * width;
          flatListRef.current.scrollToOffset({ offset, animated: true });
          setActiveIndex(nextIndex);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeIndex, trendingMovies.length]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <Link href={`/movies/${item.id}`} asChild>
      <TouchableOpacity style={styles.movieItem}>
        <SharedElement id={`item.${item.id}.poster`}>
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
        </SharedElement>
        <View style={styles.movieTextContainer}>
          <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" style={styles.starIcon} />
            <Text style={styles.ratingText}>{item.vote_average.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  const renderTrendingItem = ({ item }: { item: Movie }) => (
    <Link href={`/movies/${item.id}`} asChild>
      <TouchableOpacity style={styles.trendingItem}>
        <SharedElement id={`item.${item.id}.poster`}>
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
        </SharedElement>
        <View style={styles.trendingOverlay}>
          <Text style={styles.trendingTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingBadgeText}>Trending</Text>
          </View>
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
            <TouchableOpacity onPress={() => { setCache({}); alert('Cache cleared!'); }} style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'red', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>Clear Cache</Text>
            </TouchableOpacity>
            <Text style={styles.sectionHeader}>Trending Movies</Text>
            <FlatList
              ref={flatListRef}
              data={trendingMovies}
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
              {trendingMovies.map((_, index) => (
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
            <Text style={styles.sectionHeader}>{item.genre.name}</Text>
            <FlatList
              data={item.movies}
              renderItem={renderMovieItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.genreMovieListContainer}
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
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  // Trending Movies Styles
  trendingListContainer: {
    paddingHorizontal: 15,
  },
  trendingItem: {
    width: width,
    height: width * (9 / 16),
    borderRadius: 0,
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
  trendingBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  trendingBadgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
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
  genreMovieListContainer: {
    paddingHorizontal: 15,
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