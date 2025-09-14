import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useWishlist } from '../../context/WishlistContext';
import { getAnimeDetails } from '../../utils/anilistApi';
import { getMovieDetails, getTVShowDetails } from '../../utils/tmdbApi';
import { getMangaDetails } from '../../utils/mangaApi';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function Favorites() {
  const { wishlist, removeFromWishlist, isLoading: isWishlistLoading } = useWishlist();
  const [detailedWishlist, setDetailedWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      const detailedItems = await Promise.all(
        wishlist.map(async (item) => {
          try {
            let details;
            if (item.type === 'anime') {
              details = await getAnimeDetails(Number(item.id));
            } else if (item.type === 'movie') {
              details = await getMovieDetails(Number(item.id));
            } else if (item.type === 'tv') {
              details = await getTVShowDetails(Number(item.id));
            } else if (item.type === 'manga') {
              details = await getMangaDetails(item.id);
            }
            return { ...details, type: item.type };
          } catch (error) {
            console.error(`Failed to fetch details for ${item.type} with id ${item.id}:`, error);
            return null;
          }
        })
      );
      setDetailedWishlist(detailedItems.filter(item => item !== null));
      setIsLoading(false);
    };

    if (!isWishlistLoading) {
      fetchDetails();
    }
  }, [wishlist, isWishlistLoading]);

  const handleRemove = async (id: string, type: string) => {
    const item = detailedWishlist.find(item => item.id.toString() === id && item.type === type);
    await removeFromWishlist(id, type);
    if (item) {
      Toast.show({
        type: 'success',
        text1: 'Removed from Wishlist',
        text2: `${item.title?.english || item.title?.romaji || item.attributes?.title?.en || item.name} has been removed from your wishlist.`
      });
    }
  };

  const renderWishlistItem = ({ item }: { item: any }) => {
    const coverArt = item.relationships?.find(rel => rel.type === 'cover_art');
    const fileName = coverArt?.attributes?.fileName;
    const coverUrl = fileName ? `https://uploads.mangadex.org/covers/${item.id}/${fileName}` : 'https://via.placeholder.com/160x240';

    return (
        <View style={styles.movieItem}>
            <Link href={`/${item.type === 'movie' ? 'movies' : item.type === 'tv' ? 'tv' : item.type}/${item.id}`} asChild>
                <TouchableOpacity style={styles.posterContainer}>
                    <Image
                        source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : item.coverImage?.large || coverUrl }}
                        style={styles.poster}
                        contentFit="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.gradient}
                    />
                </TouchableOpacity>
            </Link>
            <View style={styles.movieTextContainer}>
                <Text style={styles.movieTitle} numberOfLines={2}>{item.title?.english || item.title?.romaji || item.attributes?.title?.en || item.name}</Text>
                {item.averageScore && (
                    <View style={styles.ratingContainer}>
                        <FontAwesome name="star" size={16} color="#FFD700" style={styles.starIcon} />
                        <Text style={styles.ratingText}>{(item.averageScore / 10).toFixed(1)}</Text>
                    </View>
                )}
                {item.vote_average && (
                    <View style={styles.ratingContainer}>
                        <FontAwesome name="star" size={16} color="#FFD700" style={styles.starIcon} />
                        <Text style={styles.ratingText}>{item.vote_average.toFixed(1)}</Text>
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(String(item.id), item.type)}>
                <Feather name="x-circle" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}


  if (isLoading || isWishlistLoading) {
    return (
      <View style={styles.container_loading}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wishlist</Text>
      {detailedWishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={60} color="#808080" />
          <Text style={styles.emptyText}>Your wishlist is empty!</Text>
          <Text style={styles.emptySubText}>Start adding some titles to keep track of what you want to watch or read.</Text>
        </View>
      ) : (
        <FlatList
          data={detailedWishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => `${item.id}-${item.type}`}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container_loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
    paddingTop: 48,
  },
  header: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  listContainer: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    color: '#808080',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubText: {
    color: '#a0a0a0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  movieItem: {
    width: '48%',
    height: 240,
    margin: '1%',
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
    marginRight: 5,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
});