import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Play, Star } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';


import { LinearGradient } from 'expo-linear-gradient';
import { getCache, setCache } from '../../utils/cache';
import { getTVShowDetails } from '../../utils/tmdbApi';

// Interfaces (assuming they are correct and don't need changes)
interface TVShowDetails {
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  genres: { name: string }[];
  episode_run_time: number[];
  vote_average: number;
  vote_count: number;
  production_companies: { name: string }[];
  credits: { cast: CastMember[] };
  similar: { results: SimilarTVShow[] };
  seasons: {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    poster_path: string;
  }[];
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

interface SimilarTVShow {
  id: number;
  name: string;
  poster_path: string;
}

interface TVInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: TVInfoProps) => (
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
  const [movie, setMovie] = useState<TVShowDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similarTVShows, setSimilarTVShows] = useState<SimilarTVShow[]>([]);
  const [loading, setLoading] = useState(true);

  
    
    useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const cachedTVShow = getCache().tvShowDetails[Number(id)];
        if (cachedTVShow && cachedTVShow.credits && cachedTVShow.similar) {
          setMovie(cachedTVShow);
          setCast(cachedTVShow.credits.cast);
          setSimilarTVShows(cachedTVShow.similar.results);
        } else {
          const tvShowDetails = await getTVShowDetails(Number(id));
          setMovie(tvShowDetails);
          setCast(tvShowDetails.credits.cast);
          setSimilarTVShows(tvShowDetails.similar.results);
          setCache({
            tvShowDetails: { ...getCache().tvShowDetails, [Number(id)]: tvShowDetails },
          });
        }
      } catch (error) {
        console.error("Error fetching TV show details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}> {/* Use main container style for consistency */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContentContainer}>
          {/* Skeleton for Poster */}
          <View style={styles.posterContainer}>
            <View style={[styles.poster, { backgroundColor: '#333' }]} /> {/* Placeholder for image */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradient}
            />
          </View>

          {/* Skeleton for Details */}
          <View style={styles.detailsContainer}>
            <View style={[styles.coverImage, { backgroundColor: '#333' }]} /> {/* Placeholder for cover image */}
            <View style={styles.titleContainer}>
              <View style={{ width: '80%', height: 24, backgroundColor: '#333', marginBottom: 8, borderRadius: 4 }} /> {/* Placeholder for title */}
              <View style={{ width: '60%', height: 14, backgroundColor: '#333', borderRadius: 4 }} /> {/* Placeholder for subtitle */}
            </View>
          </View>

          {/* Skeleton for Rating */}
          <View style={[styles.ratingContainer, { backgroundColor: '#333', height: 20, width: '40%', borderRadius: 4 }]} />

          {/* Skeleton for Info Sections */}
          <View style={[styles.infoSection, { marginTop: 20 }]}>
            <View style={{ width: '90%', height: 16, backgroundColor: '#333', marginBottom: 5, borderRadius: 4 }} />
            <View style={{ width: '70%', height: 16, backgroundColor: '#333', borderRadius: 4 }} />
          </View>
          <View style={[styles.infoSection, { marginTop: 10 }]}>
            <View style={{ width: '85%', height: 16, backgroundColor: '#333', marginBottom: 5, borderRadius: 4 }} />
            <View style={{ width: '65%', height: 16, backgroundColor: '#333', borderRadius: 4 }} />
          </View>
          <View style={[styles.infoSection, { marginTop: 10 }]}>
            <View style={{ width: '75%', height: 16, backgroundColor: '#333', marginBottom: 5, borderRadius: 4 }} />
            <View style={{ width: '55%', height: 16, backgroundColor: '#333', borderRadius: 4 }} />
          </View>

          {/* Skeleton for Cast Section */}
          <View style={[styles.castContainer, { marginTop: 20 }]}>
            <View style={[styles.sectionTitle, { backgroundColor: '#333', width: '30%', height: 22, borderRadius: 4, marginBottom: 10 }]} />
            <FlatList
              data={[1, 2, 3, 4]} // Dummy data for skeleton cast items
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.genreMovieListContainer} // Reusing style for horizontal list
              renderItem={() => (
                <View style={styles.castItem}>
                  <View style={[styles.castImage, { backgroundColor: '#444' }]} />
                  <View style={{ width: '80%', height: 14, backgroundColor: '#555', marginTop: 8, borderRadius: 4 }} />
                  <View style={{ width: '60%', height: 12, backgroundColor: '#555', marginTop: 4, borderRadius: 4 }} />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          {/* Skeleton for Similar TV Shows Section */}
          <View style={[styles.similarContainer, { marginTop: 20 }]}>
            <View style={[styles.sectionTitle, { backgroundColor: '#333', width: '40%', height: 22, borderRadius: 4, marginBottom: 10 }]} />
            <FlatList
              data={[1, 2, 3]} // Dummy data for skeleton similar TV show items
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.genreMovieListContainer} // Reusing style for horizontal list
              renderItem={() => (
                <View style={styles.similarItem}>
                  <View style={[styles.similarImage, { backgroundColor: '#444' }]} />
                  <View style={{ width: '90%', height: 14, backgroundColor: '#555', marginTop: 5, borderRadius: 4 }} />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>TV Show not found.</Text>
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
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
        </View>

        
            <View style={styles.detailsContainer}>
            <Image source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} style={styles.coverImage} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{movie?.name}</Text>
            </View>
        </View>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>
              {movie?.first_air_date?.split("-")[0]} • {movie?.episode_run_time[0]}m
            </Text>
          </View>

          <View style={styles.ratingContainer}>
            <Star color="white" width={16} height={16} fill="white" />
            <Text style={styles.ratingText}>{Math.round(movie?.vote_average ?? 0)}/10</Text>
            <Text style={styles.voteCountText}>({movie?.vote_count} votes)</Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo label="Genres" value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"} />

          

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
            <Text style={styles.sectionTitle}>Similar TV Shows</Text>
            <FlatList
              data={similarTVShows}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push(`/tv/${item.id}`)} style={styles.similarItem}>
                  <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={styles.similarImage} />
                  <Text style={styles.similarTitle} numberOfLines={2}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
      </ScrollView>

      <View style={styles.playButtonContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.push(`/player/tv?id=${id}`)}
        >
          <Play color="white" width={20} height={20} style={styles.playIcon} />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  playButtonContainer: { padding: 15, borderTopWidth: 1, borderColor: '#1f2937', backgroundColor: 'black' },
  playButton: { backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  playIcon: { marginRight: 10 },
  playButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  movieInfoContainer: { marginTop: 20, paddingHorizontal: 15 },
  movieInfoLabel: { color: '#9ca3af', fontSize: 14 },
  movieInfoValue: { color: 'white', fontSize: 14, fontWeight: '600', marginTop: 4 },
  financialInfoContainer: { flexDirection: 'row', justifyContent: 'space-between' },
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
  scrollContentContainer: { paddingBottom: 100 }, // Make space for play button
});

export default React.memo(Details);