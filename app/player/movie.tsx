
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import MoviePlayer from "../../components/MoviePlayer";
import { getMovieDetails } from "../../utils/tmdbApi";

export default function MoviePlayerPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [details, setDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

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
    <FlatList
      data={[]}
      ListHeaderComponent={() => (
        <View className="flex-1 bg-black">
          <View className="w-full aspect-video bg-gray-800">
            <MoviePlayer
              videoId={id as string}
              type="movie"
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
              </View>
            ) : (
              <Text className="text-white text-lg">Details not available.</Text>
            )}
          </View>
        </View>
      )}
      renderItem={null}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
