
import { useState, useEffect } from 'react';
import { Deal } from '../types';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Fetch deals data from Supabase
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .order('valid_from', { ascending: true });

        if (error) {
          throw error;
        }

        // Transform the data to match our Deal type
        const transformedDeals = data.map((deal: any) => ({
          id: deal.id,
          restaurantId: deal.restaurant_id,
          name: deal.name,
          description: deal.description || '',
          validFrom: new Date(deal.valid_from),
          validTo: new Date(deal.valid_to),
          discountType: deal.discount_type as 'percentage' | 'flat',
          discountValue: deal.discount_value
        }));

        setDeals(transformedDeals);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch deals'));
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const addDeal = async (deal: Deal) => {
    try {
      // Map the deal data to match Supabase column names
      const { data, error } = await supabase
        .from('deals')
        .insert({
          restaurant_id: deal.restaurantId,
          name: deal.name,
          description: deal.description,
          valid_from: deal.validFrom.toISOString(),
          valid_to: deal.validTo.toISOString(),
          discount_type: deal.discountType,
          discount_value: deal.discountValue
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data to match our Deal type
      const newDeal: Deal = {
        id: data.id,
        restaurantId: data.restaurant_id,
        name: data.name,
        description: data.description || '',
        validFrom: new Date(data.valid_from),
        validTo: new Date(data.valid_to),
        discountType: data.discount_type as 'percentage' | 'flat',
        discountValue: data.discount_value
      };

      setDeals(prev => [...prev, newDeal]);
      
      toast({
        title: "Deal Added",
        description: "New deal has been successfully created"
      });
      
      return newDeal;
    } catch (err) {
      console.error('Error adding deal:', err);
      
      toast({
        title: "Failed to Add Deal",
        description: "There was an error creating the deal",
        variant: "destructive"
      });
      
      setError(err instanceof Error ? err : new Error('Failed to add deal'));
      throw err;
    }
  };

  const updateDeal = async (updatedDeal: Deal) => {
    try {
      // Map the deal data to match Supabase column names
      const { data, error } = await supabase
        .from('deals')
        .update({
          restaurant_id: updatedDeal.restaurantId,
          name: updatedDeal.name,
          description: updatedDeal.description,
          valid_from: updatedDeal.validFrom.toISOString(),
          valid_to: updatedDeal.validTo.toISOString(),
          discount_type: updatedDeal.discountType,
          discount_value: updatedDeal.discountValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedDeal.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data to match our Deal type
      const transformedDeal: Deal = {
        id: data.id,
        restaurantId: data.restaurant_id,
        name: data.name,
        description: data.description || '',
        validFrom: new Date(data.valid_from),
        validTo: new Date(data.valid_to),
        discountType: data.discount_type as 'percentage' | 'flat',
        discountValue: data.discount_value
      };

      setDeals(prev => 
        prev.map(deal => deal.id === updatedDeal.id ? transformedDeal : deal)
      );
      
      toast({
        title: "Deal Updated",
        description: "Deal has been successfully updated"
      });
      
      return transformedDeal;
    } catch (err) {
      console.error('Error updating deal:', err);
      
      toast({
        title: "Failed to Update Deal",
        description: "There was an error updating the deal",
        variant: "destructive"
      });
      
      setError(err instanceof Error ? err : new Error('Failed to update deal'));
      throw err;
    }
  };

  const deleteDeal = async (dealId: string) => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

      if (error) {
        throw error;
      }

      setDeals(prev => prev.filter(deal => deal.id !== dealId));
      
      toast({
        title: "Deal Deleted",
        description: "Deal has been successfully removed"
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting deal:', err);
      
      toast({
        title: "Failed to Delete Deal",
        description: "There was an error removing the deal",
        variant: "destructive"
      });
      
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
