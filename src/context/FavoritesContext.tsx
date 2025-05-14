
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MenuItem } from '../types';
import { mockMenuItems } from '../data/mockData';
import { toast } from '@/hooks/use-toast';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (itemId: string) => void;
  removeFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  getFavoriteItems: () => MenuItem[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (itemId: string) => {
    if (!itemId) {
      console.error("Cannot add favorite: Invalid item ID");
      return;
    }
    
    setFavorites(prev => {
      if (prev.includes(itemId)) return prev;
      return [...prev, itemId];
    });
    
    toast({
      title: "Added to favorites",
      description: "Item has been added to your favorites",
      duration: 3000
    });
  };

  const removeFavorite = (itemId: string) => {
    if (!itemId) {
      console.error("Cannot remove favorite: Invalid item ID");
      return;
    }
    
    setFavorites(prev => prev.filter(id => id !== itemId));
    
    toast({
      title: "Removed from favorites",
      description: "Item has been removed from your favorites",
      duration: 3000
    });
  };

  const isFavorite = (itemId: string) => {
    if (!itemId) return false;
    return favorites.includes(itemId);
  };

  const getFavoriteItems = () => {
    if (favorites.length === 0) return [];
    
    try {
      // Ensure we only return valid items and filter out any null or undefined values
      const items = mockMenuItems
        .filter(item => item && item.id && favorites.includes(item.id));
        
      console.log("Favorite items found:", items.length);
      return items;
    } catch (error) {
      console.error("Error getting favorite items:", error);
      return [];
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addFavorite, 
      removeFavorite, 
      isFavorite,
      getFavoriteItems 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
