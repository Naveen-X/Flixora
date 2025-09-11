import { Feather } from "@expo/vector-icons";
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useMode } from "../../context/ModeContext";
import { searchMovies, searchTVShows } from "../../utils/tmdbApi";
import { searchAnime } from "../../utils/anilistApi";
import { searchManga } from "../../utils/mangaApi";
import { useRouter } from "expo-router";

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [lastSearchedText, setLastSearchedText] = useState('');
  const [movieResults, setMovieResults] = useState<any[]>([]);
  const [tvResults, setTvResults] = useState<any[]>([]);
  const [animeResults, setAnimeResults] = useState<any[]>([]);
  const [mangaResults, setMangaResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { mode } = useMode();
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setMovieResults([]);
      setTvResults([]);
      setAnimeResults([]);
      setMangaResults([]);
      setLastSearchedText('');
      return;
    }

    setLoading(true);
    setLastSearchedText(searchText);
    setMovieResults([]); // Clear previous results
    setTvResults([]);
    setAnimeResults([]);
    setMangaResults([]);

    try {
      if (mode === 'movies') {
        const results = await searchMovies(searchText);
        setMovieResults(results);
      } else if (mode === 'tv') {
        const results = await searchTVShows(searchText);
        setTvResults(results);
      } else if (mode === 'anime') {
        const results = await searchAnime(searchText);
        setAnimeResults(results);
      } else if (mode === 'manga') {
        const results = await searchManga(searchText);
        setMangaResults(results);
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black p-4 pt-16">
      <View className="flex-row items-center bg-neutral-800 rounded-full px-5 py-2.5 mb-4 border border-neutral-700">
        <Feather name="search" size={20} color="white" className="mr-3" />
        <TextInput
          className="flex-1 text-white text-lg"
          placeholder={`Search for ${mode}...`}
          placeholderTextColor="#A0A0A0"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} className="ml-3">
            <Feather name="x-circle" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <View className="flex-1">
          {/* Skeleton for Search Results Grid */}
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9]} // Dummy data for skeleton items (3 columns * 3 rows)
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={() => (
              <View className="flex-1 m-1">
                <View className="w-full h-48 rounded-lg bg-neutral-800" /> {/* Placeholder for image */}
                <View className="w-4/5 h-4 rounded-lg bg-neutral-800 mt-2 self-center" /> {/* Placeholder for title line 1 */}
                <View className="w-3/5 h-4 rounded-lg bg-neutral-800 mt-1 self-center" /> {/* Placeholder for title line 2 */}
              </View>
            )}
          />
        </View>
      ) : (
        <View className="flex-1">
          {lastSearchedText ? (
            <>
              {mode === 'movies' && movieResults.length > 0 && (
                <FlatList
                  data={movieResults}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="flex-1 m-1"
                      onPress={() => router.push(`/movies/${item.id}`)}
                    >
                      <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                        className="w-full h-48 rounded-lg"
                      />
                      <Text className="text-white text-sm mt-1 text-center" numberOfLines={2}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                  ListHeaderComponent={() => (
                    <Text className="text-white text-xl font-bold mb-4">Movies</Text>
                  )}
                />
              )}
              {mode === 'tv' && tvResults.length > 0 && (
                <FlatList
                  data={tvResults}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="flex-1 m-1"
                      onPress={() => router.push(`/tv/${item.id}`)}
                    >
                      <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                        className="w-full h-48 rounded-lg"
                      />
                      <Text className="text-white text-sm mt-1 text-center" numberOfLines={2}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  ListHeaderComponent={() => (
                    <Text className="text-white text-xl font-bold mb-4">TV Shows</Text>
                  )}
                />
              )}
              {mode === 'anime' && animeResults.length > 0 && (
                <FlatList
                  data={animeResults}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="flex-1 m-1"
                      onPress={() => router.push(`/anime/${item.id}`)}
                    >
                      <Image
                        source={{ uri: item.coverImage.large }}
                        className="w-full h-48 rounded-lg"
                      />
                      <Text className="text-white text-sm mt-1 text-center" numberOfLines={2}>{item.title.english || item.title.romaji}</Text>
                    </TouchableOpacity>
                  )}
                  ListHeaderComponent={() => (
                    <Text className="text-white text-xl font-bold mb-4">Anime</Text>
                  )}
                />
              )}
              {mode === 'manga' && mangaResults.length > 0 && (
                <FlatList
                  data={mangaResults}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item }) => {
                    const coverArt = item.relationships.find(rel => rel.type === 'cover_art');
                    const coverUrl = coverArt ? `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes?.fileName}` : 'https://via.placeholder.com/150';
                    return (
                      <TouchableOpacity
                        className="flex-1 m-1"
                        onPress={() => router.push(`/manga/${item.id}`)}
                      >
                        <Image
                          source={{ uri: coverUrl }}
                          className="w-full h-48 rounded-lg"
                        />
                        <Text className="text-white text-sm mt-1 text-center" numberOfLines={2}>{item.attributes.title.en}</Text>
                      </TouchableOpacity>
                    )
                  }}
                  ListHeaderComponent={() => (
                    <Text className="text-white text-xl font-bold mb-4">Manga</Text>
                  )}
                />
              )}
              {(movieResults.length === 0 && tvResults.length === 0 && animeResults.length === 0 && mangaResults.length === 0 && lastSearchedText) && (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-gray-400 text-lg">No results found for "{lastSearchedText}" in {mode}.</Text>
                </View>
              )}
            </>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-400 text-lg">Start typing to search</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
