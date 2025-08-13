import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Play, Star } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';


import { LinearGradient } from 'expo-linear-gradient';
import { getCache, setCache } from '../../utils/cache';
import { getMovieDetails } from '../../utils/tmdbApi';

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
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-gray-400 font-normal text-sm">{label}</Text>
    <Text className="text-white font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

function Details() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
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
        console.log("Fetching details for movie:", id);
        const cachedMovie = getCache().movieDetails[Number(id)];
        if (cachedMovie && cachedMovie.credits && cachedMovie.similar) {
          console.log("Found cached movie details:", cachedMovie);
          setMovie(cachedMovie);
          setCast(cachedMovie.credits.cast);
          setSimilarMovies(cachedMovie.similar.results);
        } else {
          console.log("Fetching movie details from API");
          const movieDetails = await getMovieDetails(Number(id));
          console.log("Fetched movie details:", movieDetails);
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

  useEffect(() => {
    // No BackHandler logic
  }, [showPlayer]);

  if (loading) {
    return (
      <SafeAreaView className="bg-gray-950 flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (!movie) {
    console.log("Movie object is null or undefined.");
    return (
      <SafeAreaView className="bg-slate-950 flex-1 justify-center items-center">
        <Text className="text-white text-lg">Movie not found.</Text>
      </SafeAreaView>
    );
  }

  console.log("Movie object before rendering:", movie);

  if (showPlayer) {
    const embedUrl = `https://vidsrc.me/embed/${id}`;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <WebView
          source={{ uri: embedUrl }}
          style={{ flex: 1 }}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
          cacheEnabled={true}
          allowsLinkPreview={false}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          mixedContentMode="always"
          injectedJavaScript={`
            (function() {
              var originalWindowOpen = window.open;
              window.open = function(url, name, features) {
                // Prevent opening new windows
                console.log('Blocked window.open:', url);
                return null; // Or return a dummy window object if needed
              };
            })();
          `}
          onLoadEnd={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('WebView Load End:', nativeEvent.url, nativeEvent.loading, nativeEvent.title, nativeEvent.canGoBack, nativeEvent.canGoForward);
          }}
          onNavigationStateChange={(navState) => {
            console.log('Navigation State Change:', navState.url);
            // If the WebView tries to navigate to an external URL, you can handle it here
            // For example, you could check if navState.url is not your expected embed URL
            // and then call navState.canGoBack() and navState.goBack() to prevent it.
          }}
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={(request) => {
            // Only allow the initial embed URL to load
            return request.url.startsWith(`https://vidsrc.me/embed/${id}`) ||
                   request.url.startsWith(`https://vidsrc.net/embed/${id}`);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <View className="bg-gray-950 flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View style={{ position: 'relative' }}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            style={{ width: '100%', height: 550 }}
            resizeMode="stretch"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' }}
          />

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center" onPress={() => setShowPlayer(true)}>
              <Play color="black" width={24} height={28} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-gray-400 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-gray-400 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-gray-800 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Star color="white" width={16} height={16} fill="white" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-gray-400 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-full">
            <MovieInfo
              label="Budget"
              value={`$${((movie?.budget ?? 0) / 1_000_000).toFixed(2)} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${((movie?.revenue ?? 0) / 1_000_000).toFixed(2)} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />

          <View style={{ marginTop: 20 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Cast</Text>
            <FlatList
              data={cast}
              renderItem={({ item }) => (
                <View style={{ marginRight: 15, alignItems: 'center' }}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${item.profile_path}` }}
                    style={{ width: 100, height: 150, borderRadius: 10 }}
                  />
                  <Text style={{ color: 'white', marginTop: 5 }}>{item.name}</Text>
                  <Text style={{ color: 'gray' }}>{item.character}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Similar Movies</Text>
            <FlatList
              data={similarMovies}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push(`/movies/${item.id}`)} style={{ marginRight: 15 }}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                    style={{ width: 120, height: 180, borderRadius: 10 }}
                  />
                  <Text style={{ color: 'white', marginTop: 5, width: 120 }} numberOfLines={2}>{item.title}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-blue-500 rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <ArrowLeft color="white" width={20} height={20} style={{ marginRight: 4, marginTop: 2, transform: [{ rotate: '180deg' }] }} />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(Details);