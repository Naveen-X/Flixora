import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getMovieDetails } from '../../utils/tmdbApi';

function Details2() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        console.log('Fetching details for movie:', id);
        const movieDetails = await getMovieDetails(Number(id));
        console.log('Fetched movie details:', movieDetails);
        setMovie(movieDetails);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Movie not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>{movie.title}</Text>
      <Text style={{ fontSize: 16, color: 'white' }}>{movie.overview}</Text>
    </View>
  );
}

export default Details2;