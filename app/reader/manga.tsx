import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { getMangaChapters, getChapterPages } from '../../utils/mangaApi';
import { ChevronLeft } from 'react-native-feather';

export default function MangaReader() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<any[]>([]);
  const [pages, setPages] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const chapterData = await getMangaChapters(id as string);
        setChapters(chapterData);
      } catch (error) {
        console.error("Error fetching manga chapters:", error);
        setError('Failed to load chapters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [id]);

  const handleChapterSelect = async (chapter: any) => {
    try {
      setLoading(true);
      setError(null);
      const pageData = await getChapterPages(chapter.id);
      if (pageData) {
        setPages(pageData);
        setSelectedChapter(chapter);
      } else {
        Alert.alert('Error', 'Could not load chapter. It may be unavailable.');
      }
    } catch (error) {
      console.error("Error fetching chapter pages:", error);
      Alert.alert('Error', 'Could not load chapter. It may be unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const renderPageItem = ({ item }: { item: string }) => (
    <Image
      source={{ uri: `${pages.baseUrl}/data-saver/${pages.hash}/${item}` }}
      style={styles.pageImage}
      resizeMode="contain"
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="white" />
          <Text style={styles.backButtonText}>Back to Details</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (pages) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setPages(null)} style={styles.backButton}>
          <ChevronLeft color="white" />
          <Text style={styles.backButtonText}>Back to Chapters</Text>
        </TouchableOpacity>
        <FlatList
          data={pages.dataSaver}
          renderItem={renderPageItem}
          keyExtractor={(item) => item}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="white" />
          <Text style={styles.backButtonText}>Back to Details</Text>
        </TouchableOpacity>
      <FlatList
        data={chapters}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChapterSelect(item)} style={styles.chapterItem}>
            <Text style={styles.chapterText}>Chapter {item.attributes.chapter} - {item.attributes.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chapterList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chapterList: {
    paddingHorizontal: 15,
    alignSelf: 'stretch'
  },
  chapterItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  chapterText: {
    color: 'white',
    fontSize: 16,
  },
  pageImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  }
});
