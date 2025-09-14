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

interface TVShow { // Added TVShow interface
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
}

interface Genre {
  id: number;
  name: string;
}

const fetchFromTmdb = async (endpoint: string) => {
  console.log("TMDB_API_KEY:", TMDB_API_KEY);
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
    console.log(error);
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
  console.log("getMovieDetails called for movieId:", movieId);
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
export const getPopularTVShows = async (): Promise<TVShow[]> => {
  const data = await fetchFromTmdb('/tv/popular');
  return data?.results || [];
};

export const getTrendingTVShows = async (): Promise<TVShow[]> => {
  const data = await fetchFromTmdb('/trending/tv/week');
  return data?.results || [];
};

export const getTVShowGenres = async (): Promise<Genre[]> => {
  const data = await fetchFromTmdb('/genre/tv/list');
  return data?.genres || [];
};

export const getTVShowsByGenre = async (genreId: number): Promise<TVShow[]> => {
  const data = await fetchFromTmdb(`/discover/tv?with_genres=${genreId}`);
  return data?.results || [];
};

export const getTVShowDetails = async (tvShowId: number) => {
  const data = await fetchFromTmdb(`/tv/${tvShowId}?append_to_response=credits,similar`);
  return data;
};

export const getTVEpisodeDetails = async (tvShowId: number, seasonNumber: number, episodeNumber: number) => {
  const data = await fetchFromTmdb(`/tv/${tvShowId}/season/${seasonNumber}/episode/${episodeNumber}`);
  return data;
};

export const getSeasonDetails = async (tvShowId: number, seasonNumber: number) => {
  const data = await fetchFromTmdb(`/tv/${tvShowId}/season/${seasonNumber}`);
  return data;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const data = await fetchFromTmdb(`/search/movie?query=${encodeURIComponent(query)}`);
  return data?.results || [];
};

export const searchTVShows = async (query: string): Promise<TVShow[]> => {
  const data = await fetchFromTmdb(`/search/tv?query=${encodeURIComponent(query)}`);
  return data?.results || [];
};