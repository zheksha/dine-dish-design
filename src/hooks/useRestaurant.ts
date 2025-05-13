
import { useState, useEffect } from 'react';
import { Restaurant } from '../types';
import { mockRestaurant } from '../data/mockData';

export const useRestaurant = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // In a real app, this would be an API call to Supabase
        // For now, we'll use mock data
        setRestaurant(mockRestaurant);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const updateRestaurant = async (updatedRestaurant: Restaurant) => {
    try {
      // In a real app, this would be an API call to Supabase
      // For now, we'll just update state
      setRestaurant(updatedRestaurant);
      return updatedRestaurant;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update restaurant'));
      throw err;
    }
  };

  return { restaurant, isLoading, error, updateRestaurant };
};
