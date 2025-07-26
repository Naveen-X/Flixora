import React from 'react';
import { Text, View } from 'react-native';
import { useMode } from "../../context/ModeContext";
import { Feather } from "@expo/vector-icons";

export default function Favorites() {
  const { mode } = useMode();

  // Dummy wishlist data for demonstration
  const wishlistData = {
    anime: ["Attack on Titan", "Jujutsu Kaisen", "Demon Slayer"],
    manga: ["Berserk", "Vagabond", "One Piece"],
    tv: ["Breaking Bad", "The Office", "Game of Thrones"],
    movies: ["Inception", "Interstellar", "The Dark Knight"],
  };

  const currentWishlist = wishlistData[mode as keyof typeof wishlistData] || [];
  const isWishlistEmpty = currentWishlist.length === 0;

  return (
    <View className="flex-1 bg-slate-950 p-4 pt-16">
      <Text className="text-white text-3xl font-bold mb-6">My {mode.charAt(0).toUpperCase() + mode.slice(1)} Wishlist</Text>

      {isWishlistEmpty ? (
        <View className="flex-1 justify-center items-center p-4">
          <Feather name="heart" size={60} color="#808080" className="mb-4" />
          <Text className="text-gray-400 text-xl font-semibold text-center mb-2">
            Your {mode} wishlist is empty!
          </Text>
          <Text className="text-gray-500 text-base text-center">
            Start adding some titles to keep track of what you want to watch or read.
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          {currentWishlist.map((item, index) => (
            <View key={index} className="bg-neutral-800 p-4 rounded-lg mb-3 flex-row items-center justify-between">
              <Text className="text-white text-lg font-medium">{item}</Text>
              <Feather name="chevron-right" size={20} color="#808080" />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}