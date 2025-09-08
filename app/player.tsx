
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import MoviePlayer from "../components/MoviePlayer";
import { getMovieDetails, getSeasonDetails, getTVShowDetails } from "../utils/tmdbApi"; // Added getSeasonDetails

export default function Player() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams();
  const [details, setDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<any>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || (type !== "movie" && type !== "tv")) {
        setLoadingDetails(false);
        return;
      }
      setLoadingDetails(true);
      try {
        let fetchedDetails;
        if (type === "movie") {
          fetchedDetails = await getMovieDetails(Number(id));
        } else if (type === "tv") {
          fetchedDetails = await getTVShowDetails(Number(id));
          if (fetchedDetails && fetchedDetails.seasons && fetchedDetails.seasons.length > 0) {
            // Set the first season as selected by default
            setSelectedSeason(fetchedDetails.seasons[0]);
          }
        }
        setDetails(fetchedDetails);
      } catch (error) {
        console.error("Error fetching details for player:", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [id, type]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (type === "tv" && selectedSeason && id) {
        setLoadingEpisodes(true);
        try {
          const seasonDetails = await getSeasonDetails(Number(id), selectedSeason.season_number);
          if (seasonDetails && seasonDetails.episodes) {
            setEpisodes(seasonDetails.episodes);
            setSelectedEpisode(seasonDetails.episodes[0]); // Select first episode by default
          }
        } catch (error) {
          console.error("Error fetching episodes:", error);
        } finally {
          setLoadingEpisodes(false);
        }
      }
    };
    fetchEpisodes();
  }, [selectedSeason, id, type]);


  if (!id) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-950">
        <Text className="text-white text-lg">No video ID found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={[]} // No data for the main FlatList, content is in ListHeaderComponent
      ListHeaderComponent={() => (
        <View className="flex-1 bg-black">
          <View className="w-full aspect-video bg-gray-800">
            <MoviePlayer
              videoId={id as string}
              type={type as string}
              seasonNumber={selectedSeason?.season_number}
              episodeNumber={selectedEpisode?.episode_number}
              onClose={() => router.back()}
            />
          </View>

          <View className="p-4 bg-gray-900 flex-1">
            {loadingDetails ? (
              <ActivityIndicator size="large" color="white" />
            ) : details ? (
              <View>
                <Text className="text-white text-2xl font-bold mb-2">{details.title || details.name}</Text>
                <Text className="text-gray-400 text-base mb-4">{details.overview}</Text>

                {type === "tv" && details.seasons && (
                  <View className="mt-4">
                    <Text className="text-white text-xl font-bold mb-2">Seasons</Text>
                    <FlatList
                      data={details.seasons}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          className={`p-2 mr-2 rounded-md ${selectedSeason?.id === item.id ? "bg-blue-600" : "bg-gray-700"}`}
                          onPress={() => setSelectedSeason(item)}
                        >
                          <Text className="text-white">{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />

                    {loadingEpisodes ? (
                      <ActivityIndicator size="large" color="white" className="mt-4" />
                    ) : (
                      <View className="mt-4">
                        <Text className="text-white text-xl font-bold mb-2">Episodes</Text>
                        <FlatList
                          data={episodes}
                          keyExtractor={(item) => item.id.toString()}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              className={`p-2 mb-2 rounded-md ${selectedEpisode?.id === item.id ? "bg-blue-600" : "bg-gray-700"}`}
                              onPress={() => setSelectedEpisode(item)}
                            >
                              <Text className="text-white">{item.episode_number}. {item.name}</Text>
                              <Text className="text-gray-400 text-sm" numberOfLines={2}>{item.overview}</Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            ) : (
              <Text className="text-white text-lg">Details not available.</Text>
            )}
          </View>
        </View>
      )}
      renderItem={null} // No items to render for the main FlatList
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
