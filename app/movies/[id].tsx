import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Heart, Play, Star } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { useWishlist } from '../../context/WishlistContext';
import { getCache, setCache } from '../../utils/cache';
import { getMovieDetails } from '../../utils/tmdbApi';
import Toast from 'react-native-toast-message';

// Interfaces (assuming they are correct and don't need changes)
interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  genres: { name: string }[];
  runtime: number;
  vote_average: number;
  vote_count: number;
  budget: number;
  revenue: number;
  production_companies: { name: string }[];
  credits: { cast: CastMember[] };
  similar: { results: SimilarMovie[] };
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
}

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View style={styles.movieInfoContainer}>
    <Text style={styles.movieInfoLabel}>{label}</Text>
    <Text style={styles.movieInfoValue}>
      {value || "N/A"}
    </Text>
  </View>
);

function Details(props) {
  const router = useRouter();
    const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(id as string, 'movie');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const cachedMovie = getCache().movieDetails[Number(id)];
        if (cachedMovie && cachedMovie.credits && cachedMovie.similar) {
          setMovie(cachedMovie);
          setCast(cachedMovie.credits.cast);
          setSimilarMovies(cachedMovie.similar.results);
        } else {
          const movieDetails = await getMovieDetails(Number(id));
          setMovie(movieDetails);
          setCast(movieDetails.credits.cast);
          setSimilarMovies(movieDetails.similar.results);
          setCache({
            movieDetails: { ...getCache().movieDetails, [Number(id)]: movieDetails },
          });
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleWishlistToggle = () => {
    if (!movie) return;
    const wishlistItem = { id: movie.id.toString(), type: 'movie', title: movie.title };
    if (isWishlisted) {
      removeFromWishlist(wishlistItem.id, wishlistItem.type);
      Toast.show({
        type: 'success',
        text1: 'Removed from Wishlist',
        text2: `${wishlistItem.title} has been removed from your wishlist.`
      });
    } else {
      addToWishlist(wishlistItem);
      Toast.show({
        type: 'success',
        text1: 'Added to Wishlist',
        text2: `${wishlistItem.title} has been added to your wishlist.`
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContentContainer}>
          {/* Skeleton UI */}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Movie not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path}` }}
            style={styles.poster}
            resizeMode="cover"
            blurRadius={5}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
        </View>

        <View style={styles.detailsContainer}>
            <Image source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} style={styles.coverImage} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{movie?.title}</Text>
            </View>
        </View>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>
              {movie?.release_date?.split("-")[0]} • {movie?.runtime}m
            </Text>
          </View>

          <View style={styles.ratingContainer}>
            <Star color="white" width={16} height={16} fill="white" />
            <Text style={styles.ratingText}>{Math.round(movie?.vote_average ?? 0)}/10</Text>
            <Text style={styles.voteCountText}>({movie?.vote_count} votes)</Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo label="Genres" value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"} />

          <View style={styles.financialInfoContainer}>
            <MovieInfo label="Budget" value={`${((movie?.budget ?? 0) / 1_000_000).toFixed(2)} million`} />
            <MovieInfo label="Revenue" value={`${((movie?.revenue ?? 0) / 1_000_000).toFixed(2)} million`} />
          </View>

          <MovieInfo label="Production Companies" value={movie?.production_companies?.map((c) => c.name).join(" • ") || "N/A"} />

          <View style={styles.castContainer}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <FlatList
              data={cast}
              renderItem={({ item }) => (
                <View style={styles.castItem}>
                  <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.profile_path}` }} style={styles.castImage} />
                  <Text style={styles.castName}>{item.name}</Text>
                  <Text style={styles.castCharacter}>{item.character}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.similarContainer}>
            <Text style={styles.sectionTitle}>Similar Movies</Text>
            <FlatList
              data={similarMovies}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push(`/movies/${item.id}`)} style={styles.similarItem}>
                  <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={styles.similarImage} />
                  <Text style={styles.similarTitle} numberOfLines={2}>{item.title}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ScrollView>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.push(`/player/movie?id=${id}`)}
        >
          <Play color="white" width={20} height={20} style={styles.playIcon} />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleWishlistToggle}
        >
          <Heart color="white" width={24} height={24} fill={isWishlisted ? "white" : "transparent"} />
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
  detailsContainer: { flexDirection: 'row', paddingHorizontal: 15, marginTop: -100, alignItems: 'flex-end' },
  coverImage: { width: 120, height: 180, borderRadius: 10, marginRight: 15 },
  titleContainer: { flex: 1, justifyContent: 'flex-end', marginBottom: 10, paddingHorizontal: 15 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitleContainer: { paddingHorizontal: 15, marginTop: 12 },
  subtitleText: { color: '#9ca3af', fontSize: 14 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 12 },
  ratingText: { color: 'white', fontWeight: 'bold', fontSize: 14, marginLeft: 4 },
  infoSection: { paddingHorizontal: 15, marginTop: 20 },
  infoLabel: { color: '#9ca3af', fontSize: 16, marginBottom: 5 },
  infoValue: { color: 'white', fontSize: 16 },
  bottomButtonsContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#1f2937', backgroundColor: 'black', alignItems: 'center' },
  playButton: { flex: 1, backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  playIcon: { marginRight: 10 },
  playButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  wishlistButton: { marginLeft: 15, padding: 10, borderRadius: 12, backgroundColor: '#374151' },
  movieInfoContainer: { marginTop: 20, paddingHorizontal: 15 },
  movieInfoLabel: { color: '#9ca3af', fontSize: 14 },
  movieInfoValue: { color: 'white', fontSize: 14, fontWeight: '600', marginTop: 4 },
  financialInfoContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 },
  sectionTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  castContainer: { marginTop: 20, paddingHorizontal: 15 },
  castItem: { marginRight: 15, alignItems: 'center', width: 100 },
  castImage: { width: 100, height: 150, borderRadius: 10 },
  castName: { color: 'white', marginTop: 8, textAlign: 'center' },
  castCharacter: { color: 'gray', fontSize: 12, textAlign: 'center' },
  similarContainer: { marginTop: 20, paddingHorizontal: 15 },
  similarItem: { marginRight: 15, width: 120 },
  similarImage: { width: 120, height: 180, borderRadius: 10 },
  similarTitle: { color: 'white', marginTop: 5, width: 120 },
  scrollContentContainer: { paddingBottom: 100 },
});

export default React.memo(Details);