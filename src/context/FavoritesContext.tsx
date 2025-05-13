
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MenuItem } from '../types';
import { mockMenuItems } from '../data/mockData';

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
    setFavorites(prev => [...prev, itemId]);
  };

  const removeFavorite = (itemId: string) => {
    setFavorites(prev => prev.filter(id => id !== itemId));
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  const getFavoriteItems = () => {
    // In a real app, this would fetch from API/database
    return mockMenuItems.filter(item => favorites.includes(item.id || ''));
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
