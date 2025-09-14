import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WishlistItem {
  id: string;
  type: string;
  title: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string, type: string) => Promise<void>;
  isInWishlist: (id: string, type: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const storedWishlist = await AsyncStorage.getItem('local_wishlist');
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        }
      } catch (e) {
        console.error("Failed to load wishlist from AsyncStorage", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadWishlist();
  }, []);

  const saveWishlist = useCallback(async (updatedWishlist: WishlistItem[]) => {
    try {
      await AsyncStorage.setItem('local_wishlist', JSON.stringify(updatedWishlist));
      setWishlist(updatedWishlist);
    } catch (e) {
      console.error("Failed to save wishlist to AsyncStorage", e);
    }
  }, []);

  const addToWishlist = useCallback(async (item: WishlistItem) => {
    setWishlist(prevWishlist => {
      const updatedWishlist = [...prevWishlist, item];
      saveWishlist(updatedWishlist);
      return updatedWishlist;
    });
  }, [saveWishlist]);

  const removeFromWishlist = useCallback(async (id: string, type: string) => {
    setWishlist(prevWishlist => {
      const updatedWishlist = prevWishlist.filter(item => !(item.id === id && item.type === type));
      saveWishlist(updatedWishlist);
      return updatedWishlist;
    });
  }, [saveWishlist]);

  const isInWishlist = useCallback((id: string, type: string) => {
    return wishlist.some(item => item.id === id && item.type === type);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};