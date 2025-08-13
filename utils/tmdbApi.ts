import Constants from 'expo-constants';

const TMDB_API_KEY = Constants.expoConfig?.extra?.tmdbApiKey;
const BASE_URL = 'https://api.themoviedb.org/3';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
}

interface Genre {
  id: number;
  name: string;
}

const fetchFromTmdb = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        accept: 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from TMDB endpoint ${endpoint}:`, error);
    return null;
  }
};

export const getPopularMovies = async (): Promise<Movie[]> => {
  const data = await fetchFromTmdb('/movie/popular');
  return data?.results || [];
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  const data = await fetchFromTmdb('/trending/movie/week');
  return data?.results || [];
};

export const getMovieGenres = async (): Promise<Genre[]> => {
  const data = await fetchFromTmdb('/genre/movie/list');
  return data?.genres || [];
};

export const getMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
  const data = await fetchFromTmdb(`/discover/movie?with_genres=${genreId}`);
  return data?.results || [];
};

export const getMovieDetails = async (movieId: number) => {
  const data = await fetchFromTmdb(`/movie/${movieId}?append_to_response=credits,similar`);
  return data;
};

export const getMovieCredits = async (movieId: number) => {
  const data = await fetchFromTmdb(`/movie/${movieId}/credits`);
  return data;
};

export const getSimilarMovies = async (movieId: number) => {
  const data = await fetchFromTmdb(`/movie/${movieId}/similar`);
  return data?.results || [];
};