import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, ScrollView } from "react-native";
import MoviePlayer from "../../components/MoviePlayer";
import { getSeasonDetails, getTVShowDetails } from "../../utils/tmdbApi";

export default function TVPlayerPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [details, setDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<any>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [selectedSource, setSelectedSource] = useState<'videasy' | 'vidlink'>('videasy');
  const [selectedVidlinkProVariant, setSelectedVidlinkProVariant] = useState<'default' | 'custom'>('default');

  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 10; // You can adjust this number

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setLoadingDetails(false);
        return;
      }
      setLoadingDetails(true);
      try {
        const fetchedDetails = await getTVShowDetails(Number(id));
        if (fetchedDetails && fetchedDetails.seasons && fetchedDetails.seasons.length > 0) {
          setSelectedSeason(fetchedDetails.seasons[0]);
        }
        setDetails(fetchedDetails);
      } catch (error) {
        console.error("Error fetching details for player:", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (selectedSeason && id) {
        setLoadingEpisodes(true);
        try {
          const seasonDetails = await getSeasonDetails(Number(id), selectedSeason.season_number);
          if (seasonDetails && seasonDetails.episodes) {
            setEpisodes(seasonDetails.episodes);
            setSelectedEpisode(seasonDetails.episodes[0]);
          }
        } catch (error) {
          console.error("Error fetching episodes:", error);
        } finally {
          setLoadingEpisodes(false);
        }
      }
    };
    fetchEpisodes();
  }, [selectedSeason, id]);

  if (!id) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">No video ID found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black"> {/* Added this wrapper View */}
      <FlatList
        data={[]}
        ListHeaderComponent={() => (
          <View className="flex-1 bg-black">
            {/* Video Player Section */}
            <View className="w-full aspect-video bg-gray-800">
              <MoviePlayer
                videoId={id as string}
                type="tv"
                seasonNumber={selectedSeason?.season_number}
                episodeNumber={selectedEpisode?.episode_number}
                onClose={() => router.back()}
                sourceType={selectedSource}
                vidlinkProVariant={selectedVidlinkProVariant}
              />
            </View>

            {/* Server selection buttons */}
            <View className="flex-row justify-around p-4 bg-gray-900">
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${selectedSource === 'videasy' ? 'bg-blue-600' : 'bg-gray-700'}`}
                onPress={() => setSelectedSource('videasy')}
              >
                <Text className="text-white">Default (Videasy)</Text>
              </TouchableOpacity>
              <View className="flex-col">
                <TouchableOpacity
                  className={`px-4 py-2 rounded-t-lg ${selectedSource === 'vidlink' && selectedVidlinkProVariant === 'default' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  onPress={() => { setSelectedSource('vidlink'); setSelectedVidlinkProVariant('default'); }}
                >
                  <Text className="text-white">Vidlink.pro (Default)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-4 py-2 rounded-b-lg mt-px ${selectedSource === 'vidlink' && selectedVidlinkProVariant === 'custom' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  onPress={() => { setSelectedSource('vidlink'); setSelectedVidlinkProVariant('custom'); }}
                >
                  <Text className="text-white">Vidlink.pro (JWPlayer)</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* TV Show Details Section */}
            <ScrollView className="p-4 bg-gray-900 flex-1">
              {loadingDetails ? (
                <ActivityIndicator size="large" color="white" />
              ) : details ? (
                <View>
                  <Text className="text-white text-2xl font-bold mb-2">{details.title || details.name}</Text>
                  <Text className="text-gray-400 text-base mb-4">{details.overview}</Text>

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
                        {episodes.length > 0 ? (
                          <>
                            <FlatList
                              data={episodes.slice((currentPage - 1) * episodesPerPage, currentPage * episodesPerPage)}
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
                            {/* Pagination Controls */}
                            <View className="flex-row justify-between mt-4">
                              <TouchableOpacity
                                className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-700' : 'bg-blue-600'}`}
                                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                              >
                                <Text className="text-white">Previous</Text>
                              </TouchableOpacity>
                              <Text className="text-white text-lg">{currentPage} / {Math.ceil(episodes.length / episodesPerPage)}</Text>
                              <TouchableOpacity
                                className={`px-4 py-2 rounded-lg ${currentPage * episodesPerPage >= episodes.length ? 'bg-gray-700' : 'bg-blue-600'}`}
                                onPress={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage * episodesPerPage >= episodes.length}
                              >
                                <Text className="text-white">Next</Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        ) : (
                          <Text className="text-gray-400 text-lg">No episodes found for this season.</Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <Text className="text-white text-lg">Details not available.</Text>
              )}
            </ScrollView>
          </View>
        )}
        renderItem={null}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}