import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, ScrollView } from "react-native";
import MoviePlayer from "../../components/MoviePlayer";
import { getMovieDetails } from "../../utils/tmdbApi";

export default function MoviePlayerPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [details, setDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [selectedSource, setSelectedSource] = useState<'videasy' | 'vidlink'>('videasy');
  const [selectedVidlinkProVariant, setSelectedVidlinkProVariant] = useState<'default' | 'custom'>('default');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setLoadingDetails(false);
        return;
      }
      setLoadingDetails(true);
      try {
        const fetchedDetails = await getMovieDetails(Number(id));
        setDetails(fetchedDetails);
      } catch (error) {
        console.error("Error fetching details for player:", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [id]);

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
                type="movie"
                onClose={() => router.back()}
                sourceType={selectedSource}
                vidlinkProVariant={selectedVidlinkProVariant}
              />
            </View>

            {/* Server Selection Buttons */}
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

            {/* Movie Details Section */}
            <ScrollView className="p-4 bg-gray-900 flex-1">
              {loadingDetails ? (
                <ActivityIndicator size="large" color="white" />
              ) : details ? (
                <View>
                  <Text className="text-white text-2xl font-bold mb-2">{details.title || details.name}</Text>
                  <Text className="text-gray-400 text-base mb-4">{details.overview}</Text>
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