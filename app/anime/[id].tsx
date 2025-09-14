import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Heart, Play, Star } from 'react-native-feather';
import { Anime, getAnimeDetails } from '../../utils/anilistApi';
import { useWishlist } from '../../context/WishlistContext';
import Toast from 'react-native-toast-message';

export default function AnimeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [dub, setDub] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = anime ? isInWishlist(anime.id.toString(), 'anime') : false;

  const handleWishlistToggle = () => {
    if (!anime) return;
    const wishlistItem = { id: anime.id.toString(), type: 'anime', title: anime.title.english || anime.title.romaji };
    if (isWishlisted) {
      removeFromWishlist(wishlistItem.id, wishlistItem.type);
      Toast.show({
        type: 'success',
        text1: 'Removed from Wishlist',
        text2: `${wishlistItem.title} has been removed from your wishlist.`
      });
    } else {
      addToWishlist(wishlistItem);
      Toast.show({
        type: 'success',
        text1: 'Added to Wishlist',
        text2: `${wishlistItem.title} has been added to your wishlist.`
      });
    }
  };

  

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const animeDetails = await getAnimeDetails(Number(id));
        setAnime(animeDetails);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}> {/* Use main container style for consistency */}
        <ScrollView style={{ flex: 1, backgroundColor: 'black' }} contentContainerStyle={styles.scrollContentContainer}>
          {/* Skeleton for Poster */}
          <View style={styles.posterContainer}>
            <View style={[styles.poster, { backgroundColor: '#333' }]} /> {/* Placeholder for image */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradient}
            />
          </View>

          {/* Skeleton for Details */}
          <View style={styles.detailsContainer}>
            <View style={[styles.coverImage, { backgroundColor: '#333' }]} /> {/* Placeholder for cover image */}
            <View style={styles.titleContainer}>
              <View style={{ width: '80%', height: 24, backgroundColor: '#333', marginBottom: 8, borderRadius: 4 }} /> {/* Placeholder for title */}
              <View style={{ width: '60%', height: 14, backgroundColor: '#333', borderRadius: 4 }} /> {/* Placeholder for subtitle */}
            </View>
          </View>

          {/* Skeleton for Rating */}
          <View style={[styles.ratingContainer, { backgroundColor: '#333', height: 20, width: '40%', borderRadius: 4 }]} />

          {/* Skeleton for Info Sections */}
          <View style={[styles.infoSection, { marginTop: 20 }]}>
            <View style={{ width: '90%', height: 16, backgroundColor: '#333', marginBottom: 5, borderRadius: 4 }} />
            <View style={{ width: '70%', height: 16, backgroundColor: '#333', borderRadius: 4 }} />
          </View>
          <View style={[styles.infoSection, { marginTop: 10 }]}>
            <View style={{ width: '85%', height: 16, backgroundColor: '#333', marginBottom: 5, borderRadius: 4 }} />
            <View style={{ width: '65%', height: 16, backgroundColor: '#333', borderRadius: 4 }} />
          </View>
          <View style={[styles.infoSection, { marginTop: 10 }]}>
            <View style={{ width: '75%', height: 16, backgroundColor: '#333', marginBottom: 5, borderRadius: 4 }} />
            <View style={{ width: '55%', height: 16, backgroundColor: '#333', borderRadius: 4 }} />
          </View>

          {/* Skeleton for Episodes Section */}
          <View style={[styles.infoSection, { marginTop: 20 }]}>
            <View style={[styles.infoLabel, { backgroundColor: '#333', width: '30%', height: 20, borderRadius: 4, marginBottom: 10 }]} />
            <FlatList
              data={[1, 2, 3, 4, 5, 6]} // Dummy data for skeleton episode items (2 columns * 3 rows)
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.episodeListContainer}
              renderItem={() => (
                <View style={[styles.episodeButton, { backgroundColor: '#333' }]}>
                  <View style={{ width: '80%', height: 16, backgroundColor: '#444', borderRadius: 4 }} />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            {/* Skeleton for Pagination Controls */}
            <View style={styles.paginationContainer}>
              <View style={[styles.paginationButton, { backgroundColor: '#333', width: 80, height: 30, borderRadius: 10 }]} />
              <View style={{ width: 40, height: 20, backgroundColor: '#333', borderRadius: 4 }} />
              <View style={[styles.paginationButton, { backgroundColor: '#333', width: 80, height: 30, borderRadius: 10 }]} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!anime) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Anime not found.</Text>
      </View>
    );
  }

  

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, backgroundColor: 'black' }} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: anime.bannerImage || anime.coverImage.extraLarge }}
            style={styles.poster}
            resizeMode="cover"
            blurRadius={5}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
        </View>

        <View style={styles.detailsContainer}>
            <Image source={{uri: anime.coverImage.large}} style={styles.coverImage} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{anime.title.english || anime.title.romaji}</Text>
                <Text style={styles.subtitleText}>{anime.title.native}</Text>
            </View>
        </View>

        <View style={styles.ratingContainer}>
            <Star color="white" width={16} height={16} fill="white" />
            <Text style={styles.ratingText}>{anime.averageScore ? anime.averageScore / 10 : 'N/A'}/10</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Genres</Text>
            <Text style={styles.infoValue}>{anime.genres.join(', ')}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{anime.status}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Episodes</Text>
            <Text style={styles.infoValue}>{anime.episodes}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Aired</Text>
            <Text style={styles.infoValue}>
                {anime.startDate ? `${anime.startDate.year}-${anime.startDate.month}-${anime.startDate.day}` : 'N/A'}
                {anime.endDate && anime.endDate.year ? ` to ${anime.endDate.year}-${anime.endDate.month}-${anime.endDate.day}` : ''}
            </Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Season</Text>
            <Text style={styles.infoValue}>
                {anime.season ? `${anime.season} ${anime.seasonYear}` : 'N/A'}
            </Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Source</Text>
            <Text style={styles.infoValue}>{anime.source || 'N/A'}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Studio</Text>
            <Text style={styles.infoValue}>
                {anime.studios && anime.studios.nodes && anime.studios.nodes.length > 0
                    ? anime.studios.nodes.map(studio => studio.name).join(', ')
                    : 'N/A'}
            </Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Format</Text>
            <Text style={styles.infoValue}>{anime.format || 'N/A'}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoValue}>{anime.description.replace(/<br>/g, '\n')}</Text>
        </View>

        

      </ScrollView>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.push(`/player/anime?id=${anime.id}`)}
        >
          <Play color="white" width={20} height={20} style={styles.playIcon} />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleWishlistToggle}
        >
          <Heart color="white" width={24} height={24} fill={isWishlisted ? "white" : "transparent"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
    errorText: { color: 'white', fontSize: 18 },
    posterContainer: { position: 'relative' },
    poster: { width: '100%', height: 300 },
    gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' },
    detailsContainer: { flexDirection: 'row', paddingHorizontal: 15, marginTop: -100 },
    coverImage: { width: 120, height: 180, borderRadius: 10, marginRight: 15 },
    titleContainer: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 15 },
    title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    subtitleText: { color: '#9ca3af', fontSize: 14 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 12 },
    ratingText: { color: 'white', fontWeight: 'bold', fontSize: 14, marginLeft: 4 },
    infoSection: { paddingHorizontal: 15, marginTop: 20 },
    infoLabel: { color: '#9ca3af', fontSize: 16, marginBottom: 5 },
    infoValue: { color: 'white', fontSize: 16 },
    bottomButtonsContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#1f2937', backgroundColor: 'black', alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
    playButton: { flex: 1, backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    playIcon: { marginRight: 10 },
    playButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    wishlistButton: { marginLeft: 15, padding: 10, borderRadius: 12, backgroundColor: '#374151' },
    scrollContentContainer: { paddingBottom: 100, flexGrow: 1 }, 
    
});