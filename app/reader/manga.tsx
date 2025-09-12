import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { getMangaChapters, getChapterPages } from '../../utils/mangaApi';
import { BookOpen, ChevronLeft, Layers } from 'react-native-feather';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const CHAPTER_LIMIT = 50; // Number of chapters to fetch per page

export default function MangaReader() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<any[]>([]);
  const [pages, setPages] = useState<any | null>(null);
  const [pageDimensions, setPageDimensions] = useState<Array<{ width: number; height: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [dimensionsLoading, setDimensionsLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [readingMode, setReadingMode] = useState<'vertical'>('vertical'); // Set vertical as default
  const [showControls, setShowControls] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Chapter list pagination states
  const [chapterOffset, setChapterOffset] = useState(0);
  const [hasMoreChapters, setHasMoreChapters] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false); // For loading more chapters

  const pagerRef = useRef<PagerView>(null);
  const insets = useSafeAreaInsets();

  const fetchChapters = async (offset: number, append: boolean = true) => {
    if (!id || chaptersLoading || (!hasMoreChapters && append)) return;
    setChaptersLoading(true);
    try {
      const newChapters = await getMangaChapters(id as string, offset, CHAPTER_LIMIT);
      if (newChapters.length === 0) {
        setHasMoreChapters(false);
      } else {
        setChapters((prevChapters) => {
          const combinedChapters = append ? [...prevChapters, ...newChapters] : newChapters;
          // Filter out duplicates based on chapter ID
          const uniqueNewChapters = combinedChapters.filter(
            (chap, index, self) => index === self.findIndex((t) => t.id === chap.id)
          );
          // Chapters are already sorted by MangaDex API (descending by default, then ascending by chapter number in getMangaChapters)
          // No additional sorting needed here for pagination
          return uniqueNewChapters;
        });
        setChapterOffset((prevOffset) => prevOffset + newChapters.length);
        setHasMoreChapters(newChapters.length === CHAPTER_LIMIT); // Update hasMoreChapters based on if a full batch was returned
      }
    } catch (error) {
      console.error("Error fetching manga chapters:", error);
      setError('Failed to load chapters. Please try again later.');
    } finally {
      setChaptersLoading(false);
      setLoading(false); // Initial loading done after first fetch
    }
  };

  useEffect(() => {
    // Reset chapters and offset when sort order changes to refetch and re-sort
    setChapters([]); // Clear existing chapters
    setChapterOffset(0); // Reset offset
    setHasMoreChapters(true); // Assume there are more chapters
    setLoading(true); // Show initial loading indicator
    fetchChapters(0, false); // Fetch first batch, do not append
  }, [id]); // Removed sortOrder dependency

  const loadMoreChapters = () => {
    if (!loading && !chaptersLoading && hasMoreChapters) {
      fetchChapters(chapterOffset);
    }
  };

  const fetchPageDimensions = async (pageData: any) => {
    setDimensionsLoading(true);
    try {
      const dimensions = await Promise.all(
        pageData.chapter.dataSaver.map((item: string) => {
          return new Promise<{ width: number; height: number }>((resolve, reject) => {
            const imageUrl = `${pageData.baseUrl}/data-saver/${pageData.chapter.hash}/${item}`;
            Image.getSize(imageUrl, (width, height) => {
              resolve({ width, height });
            }, (error) => {
              console.error(`Failed to get image size for ${imageUrl}`, error);
              resolve({ width: screenWidth, height: 300 }); // Fallback size
            });
          });
        })
      );
      setPageDimensions(dimensions);
    } catch (error) {
      console.error("Error fetching page dimensions:", error);
    } finally {
      setDimensionsLoading(false);
    }
  };

  const isPagesDataExpired = useCallback(() => {
    if (!pages) return false;
    return Date.now() - pages.timestamp > TOKEN_REFRESH_INTERVAL;
  }, [pages]);

  const refreshPagesData = useCallback(async () => {
    if (!selectedChapter) return;

    try {
      const pageData = await getChapterPages(selectedChapter.id);
      if (pageData) {
        setPages({ ...pageData, timestamp: Date.now() });
        if (readingMode === 'vertical') {
          fetchPageDimensions({ ...pageData, timestamp: Date.now() });
        }
      } else {
        Alert.alert('Error', 'Failed to refresh chapter data.');
      }
    } catch (error) {
      console.error("Error refreshing chapter pages:", error);
      Alert.alert('Error', 'Failed to refresh chapter data. Images may not load properly.');
    }
  }, [selectedChapter, readingMode]);

  useEffect(() => {
    if (!pages || !selectedChapter) return;

    const checkAndRefresh = () => {
      if (isPagesDataExpired()) {
        refreshPagesData();
      }
    };

    const interval = setInterval(checkAndRefresh, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [pages, selectedChapter, isPagesDataExpired, refreshPagesData]);

  const handleChapterSelect = async (chapter: any) => {
    try {
      setLoading(true);
      setError(null);
      setPageDimensions([]);
      const pageData = await getChapterPages(chapter.id);
      if (pageData && pageData.chapter) {
        setPages({ ...pageData, timestamp: Date.now() });
        setSelectedChapter(chapter);
        setCurrentPage(1);
        if (readingMode === 'vertical') {
          fetchPageDimensions({ ...pageData, timestamp: Date.now() });
        }
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

  const renderHorizontalPage = (item: string) => (
    <TouchableOpacity onPress={() => setShowControls(!showControls)} activeOpacity={1}>
      <Image
        source={{ uri: `${pages.baseUrl}/data-saver/${pages.chapter.hash}/${item}` }}
        style={styles.pageImageHorizontal}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderChapterListItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleChapterSelect(item)} style={styles.chapterItem}>
      <Text style={styles.chapterNumber}>Chapter {item.attributes.chapter}</Text>
      {item.attributes.title && <Text style={styles.chapterTitle}>{item.attributes.title}</Text>}
    </TouchableOpacity>
  );

  const renderChapterListFooter = () => {
    if (!hasMoreChapters) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  };

  if (loading && chapters.length === 0) {
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
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { top: insets.top + 10 }]}>
          <ChevronLeft color="white" />
          <Text style={styles.backButtonText}>Back to Details</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (pages) {
    return (
      <View style={styles.container}>
        {showControls && (
          <View style={[styles.controlsOverlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <TouchableOpacity onPress={() => { setPages(null); setPageDimensions([]); }} style={styles.controlButton}>
              <ChevronLeft color="white" />
              <Text style={styles.controlButtonText}>Chapters</Text>
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>{readingMode === 'horizontal' ? `${currentPage} / ${pages.chapter.dataSaver.length}` : ''}</Text>
            <TouchableOpacity onPress={() => setReadingMode(readingMode === 'horizontal' ? 'vertical' : 'horizontal')} style={styles.controlButton}>
              {readingMode === 'horizontal' ? <Layers color="white" /> : <BookOpen color="white" />}
              <Text style={styles.controlButtonText}>{readingMode === 'horizontal' ? 'Vertical' : 'Horizontal'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {dimensionsLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : readingMode === 'horizontal' ? (
          <PagerView
            ref={pagerRef}
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position + 1)}
          >
            {pages.chapter.dataSaver.map((item: string, index: number) => (
              <View key={index} style={styles.pageContainer}>
                {renderHorizontalPage(item)}
              </View>
            ))}
          </PagerView>
        ) : (
          <FlatList
            data={pages.chapter.dataSaver}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const dimensions = pageDimensions[index];
              const imageHeight = dimensions ? (screenWidth / dimensions.width) * dimensions.height : 300;
              return (
                <Image
                  source={{ uri: `${pages.baseUrl}/data-saver/${pages.chapter.hash}/${item}` }}
                  style={{ width: screenWidth, height: imageHeight }}
                />
              );
            }}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={[styles.chapterListHeader, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft color="white" />
                <Text style={styles.backButtonText}>Back to Details</Text>
            </TouchableOpacity>
            {/* Removed Sort Button */}
        </View>
      <FlatList
        data={chapters}
        renderItem={renderChapterListItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chapterList}
        onEndReached={loadMoreChapters}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderChapterListFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagerView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterList: {
    paddingHorizontal: 15,
  },
  chapterItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chapterTitle: {
    color: '#ccc',
    fontSize: 14,
    flexShrink: 1,
    marginLeft: 10,
  },
  pageImageHorizontal: {
    width: screenWidth,
    height: Dimensions.get('window').height,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
    margin: 20,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 10,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  pageIndicator: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chapterListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    marginBottom: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  sortButtonText: {
    color: 'white',
    fontSize: 14,
    marginRight: 5,
  },
});