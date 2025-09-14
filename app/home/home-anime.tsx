import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Anime, getPopularAnime, getTopRatedAnime, getTrendingAnime } from '../../utils/anilistApi';
import { getCache, setCache } from '../../utils/cache';

export default function HomeAnime() {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]); // Added
  const [topRatedAnime, setTopRatedAnime] = useState<Anime[]>([]); // Added
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); // Added
  const flatListRef = useRef<FlatList<Anime>>(null); // Added

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cachedData = getCache();
        if (cachedData?.trendingAnime?.length > 0 && cachedData?.popularAnime?.length > 0 && cachedData?.topRatedAnime?.length > 0) {
          setTrendingAnime(cachedData.trendingAnime);
          setPopularAnime(cachedData.popularAnime);
          setTopRatedAnime(cachedData.topRatedAnime);
          setLoading(false);
          return;
        }

        const trending = await getTrendingAnime();
        setTrendingAnime(trending);
        console.log("Trending Anime:", trending.length);

        const popular = await getPopularAnime(); // Fetch popular anime
        setPopularAnime(popular);
        console.log("Popular Anime:", popular.length);

        const topRated = await getTopRatedAnime(); // Fetch top-rated anime
        setTopRatedAnime(topRated);
        console.log("Top Rated Anime:", topRated.length);

        // Update cache
        setCache({ trendingAnime: trending, popularAnime: popular, topRatedAnime: topRated });
      } catch (error) {
        console.error("HomeAnime: Error fetching home screen data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (trendingAnime.length > 0) {
      const interval = setInterval(() => {
        if (flatListRef.current) {
          const nextIndex = (activeIndex + 1) % trendingAnime.length;
          const offset = nextIndex * Dimensions.get('window').width; // Use Dimensions.get('window').width
          flatListRef.current.scrollToOffset({ offset, animated: true });
          setActiveIndex(nextIndex);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeIndex, trendingAnime.length]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const renderAnimeItem = ({ item }: { item: Anime }) => (
    <Link href={`/anime/${item.id}`} asChild>
      <TouchableOpacity style={styles.movieItem}>
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: item.coverImage.large }}
            style={styles.poster}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
        </View>
        <View style={styles.movieTextContainer}>
          <Text style={styles.movieTitle} numberOfLines={2}>{item.title.english || item.title.romaji}</Text>
          {/* Add rating if available in Anime interface */}
          {item.averageScore && (
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#FFD700" style={styles.starIcon} />
              <Text style={styles.ratingText}>{(item.averageScore / 10).toFixed(1)}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );

  const renderTrendingItem = ({ item }: { item: Anime }) => (
    <Link href={`/anime/${item.id}`} asChild>
      <TouchableOpacity style={styles.trendingItem}>
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: item.bannerImage || item.coverImage.extraLarge }} // Use bannerImage or extraLarge cover
            style={styles.trendingBackdrop}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.gradient}
          />
        </View>
        <View style={styles.trendingOverlay}>
          <Text style={styles.trendingTitle} numberOfLines={2}>{item.title.english || item.title.romaji}</Text>
          {/* Add rating if available in Anime interface */}
          {item.averageScore && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingBadgeText}>{(item.averageScore / 10).toFixed(1)} / 10</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {/* Skeleton for Title Header */}
        <View style={[styles.titleHeader, { backgroundColor: '#333', width: '50%', height: 30, borderRadius: 4, marginBottom: 20 }]} />

        {/* Skeleton for Trending Anime */}
        <FlatList
          data={[1, 2]} // Dummy data for skeleton items
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={Dimensions.get('window').width}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 0 }}
          renderItem={() => (
            <View style={[styles.trendingItem, { backgroundColor: '#333' }]}>
              <View style={[styles.trendingBackdrop, { backgroundColor: '#444' }]} />
              <View style={styles.trendingOverlay}>
                <View style={{ width: '70%', height: 24, backgroundColor: '#555', marginBottom: 10, borderRadius: 4 }} />
                <View style={{ width: '30%', height: 18, backgroundColor: '#555', borderRadius: 4 }} />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{ height: Dimensions.get('window').width * (9 / 16) + 20 }} // Added fixed height
        />
        {/* Skeleton for Pager Dots */}
        <View style={styles.pagerContainer}>
          {[1, 2, 3].map((_, index) => (
            <View
              key={index}
              style={[styles.pagerDot, { backgroundColor: '#555' }]}
            />
          ))}
        </View>

        {/* Skeleton for Genre Sections (Placeholder) */}
        {[1, 2, 3].map((sectionIndex) => (
          <View key={sectionIndex} style={styles.genreSection}> {/* Reusing genreSection style */} 
            <View style={[styles.sectionHeader, { backgroundColor: '#333', width: '60%', height: 25, borderRadius: 4, marginBottom: 10 }]} />
            <FlatList
              data={[1, 2, 3, 4]} // Dummy data for skeleton movie items
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.genreMovieListContainer} // Reusing style
              renderItem={() => (
                <View style={[styles.movieItem, { backgroundColor: '#333' }]}>
                  <View style={[styles.poster, { backgroundColor: '#444' }]} />
                  <View style={styles.movieTextContainer}>
                    <View style={{ width: '80%', height: 16, backgroundColor: '#555', marginBottom: 5, borderRadius: 4 }} />
                    <View style={{ width: '40%', height: 14, backgroundColor: '#555', borderRadius: 4 }} />
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.titleHeader}>Trending Anime</Text>
            <FlatList
              ref={flatListRef}
              data={trendingAnime}
              renderItem={renderTrendingItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={Dimensions.get('window').width} // Item width
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 0 }}
              initialNumToRender={3} // Optimize rendering
              windowSize={9} // Optimize rendering
              maxToRenderPerBatch={5} // Optimize rendering
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            />
            <View style={styles.pagerContainer}>
              {trendingAnime.map((_, index) => (
                <View
                  key={index}
                  style={[styles.pagerDot, { backgroundColor: activeIndex === index ? '#FFD700' : '#888' }]}
                />
              ))}
            </View>

            {/* Popular Anime Section */}
            {popularAnime.length > 0 && (
              <View style={styles.genreSection}>
                <Text style={styles.sectionHeader}>Popular Anime</Text>
                <FlatList
                  data={popularAnime}
                  renderItem={renderAnimeItem}
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

            {/* Top Rated Anime Section */}
            {topRatedAnime.length > 0 && (
              <View style={styles.genreSection}>
                <Text style={styles.sectionHeader}>Top Rated Anime</Text>
                <FlatList
                  data={topRatedAnime}
                  renderItem={renderAnimeItem}
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
          </>
        }
        data={[]} // No main data for FlatList, content is in ListHeaderComponent
        renderItem={null} // No renderItem for main FlatList
        keyExtractor={(item, index) => index.toString()} // Dummy keyExtractor
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
  // Trending Anime Styles (aligned with movies/tv)
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
  trendingBadge: { // Reused for rating display
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
  // Movie Item Styles (aligned with movies/tv)
  movieItem: { // Renamed from movieItem to be generic for anime items
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