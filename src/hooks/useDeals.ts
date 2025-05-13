
import { useState, useEffect } from 'react';
import { Deal } from '../types';
import { mockDeals } from '../data/mockData';

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // In a real app, this would be an API call to Supabase
        // For now, we'll use mock data
        setDeals(mockDeals);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch deals'));
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const addDeal = async (deal: Deal) => {
    try {
      // In a real app, this would be an API call to Supabase
      const newDeal = { ...deal, id: String(Date.now()) };
      setDeals(prev => [...prev, newDeal]);
      return newDeal;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add deal'));
      throw err;
    }
  };

  const updateDeal = async (updatedDeal: Deal) => {
    try {
      // In a real app, this would be an API call to Supabase
      setDeals(prev => 
        prev.map(deal => deal.id === updatedDeal.id ? updatedDeal : deal)
      );
      return updatedDeal;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update deal'));
      throw err;
    }
  };

  const deleteDeal = async (dealId: string) => {
    try {
      // In a real app, this would be an API call to Supabase
      setDeals(prev => prev.filter(deal => deal.id !== dealId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete deal'));
      throw err;
    }
  };

  const getActiveDeals = () => {
    const now = new Date();
    return deals.filter(
      deal => new Date(deal.validFrom) <= now && new Date(deal.validTo) >= now
    );
  };

  return {
    deals,
    isLoading,
    error,
    addDeal,
    updateDeal,
    deleteDeal,
    getActiveDeals
  };
};
