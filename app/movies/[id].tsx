import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Play, Star } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { SharedElement } from 'react-navigation-shared-element';

import { LinearGradient } from 'expo-linear-gradient';
import { getCache, setCache } from '../../utils/cache';
import { getMovieDetails } from '../../utils/tmdbApi';

// Interfaces (assuming they are correct and don't need changes)
interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string;
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
  const { id } = props.route.params;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
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
          <SharedElement id={`item.${id}.poster`}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
              style={styles.poster}
              resizeMode="cover"
            />
          </SharedElement>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{movie?.title}</Text>
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
        </View>
      </ScrollView>

      <View style={styles.playButtonContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.push(`/player/movie?id=${id}`)}
        >
          <Play color="white" width={20} height={20} style={styles.playIcon} />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

Details.sharedElements = (route) => {
  const { id } = route.params;
  return [{ id: `item.${id}.poster`, animation: 'move', resize: 'clip' }];
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  errorText: { color: 'white', fontSize: 18 },
  scrollContentContainer: { paddingBottom: 100 }, // Make space for play button
  posterContainer: { position: 'relative' },
  poster: { width: '100%', height: 550 },
  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' },
  detailsContainer: { paddingHorizontal: 15, marginTop: 20 },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  subtitleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  subtitleText: { color: '#9ca3af', fontSize: 14 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f2937', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 12, alignSelf: 'flex-start' },
  ratingText: { color: 'white', fontWeight: 'bold', fontSize: 14, marginLeft: 4 },
  voteCountText: { color: '#9ca3af', fontSize: 12, marginLeft: 8 },
  movieInfoContainer: { marginTop: 20 },
  movieInfoLabel: { color: '#9ca3af', fontSize: 14 },
  movieInfoValue: { color: 'white', fontSize: 14, fontWeight: '600', marginTop: 4 },
  financialInfoContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  castContainer: { marginTop: 20 },
  castItem: { marginRight: 15, alignItems: 'center', width: 100 },
  castImage: { width: 100, height: 150, borderRadius: 10 },
  castName: { color: 'white', marginTop: 8, textAlign: 'center' },
  castCharacter: { color: 'gray', fontSize: 12, textAlign: 'center' },
  similarContainer: { marginTop: 20 },
  similarItem: { marginRight: 15, width: 120 },
  similarImage: { width: 120, height: 180, borderRadius: 10 },
  similarTitle: { color: 'white', marginTop: 5, width: 120 },
  playButtonContainer: { padding: 15, borderTopWidth: 1, borderColor: '#1f2937', backgroundColor: 'black' },
  playButton: { backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  playIcon: { marginRight: 10 },
  playButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default React.memo(Details);