
import { useState, useEffect } from 'react';
import { Restaurant } from '../types';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRestaurant = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // Fetch restaurant data from Supabase
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          throw error;
        }

        // Handle themeSettings - ensure it's properly typed
        let themeSettings = {
          primary: '#0f172a',
          secondary: '#e5e7eb',
          accent: '#3b82f6',
          background: '#ffffff'
        };

        // If themeSettings exists in data and is an object, use it
        if (data.theme_settings && typeof data.theme_settings === 'object') {
          themeSettings = {
            primary: data.theme_settings.primary as string || themeSettings.primary,
            secondary: data.theme_settings.secondary as string || themeSettings.secondary,
            accent: data.theme_settings.accent as string || themeSettings.accent,
            background: data.theme_settings.background as string || themeSettings.background
          };
        }

        setRestaurant({
          id: data.id,
          name: data.name,
          address: data.address,
          contactEmail: data.contact_email,
          contactPhone: data.contact_phone,
          logoUrl: data.logo_url,
          themeId: data.theme_id || 'default-light',
          themeSettings: themeSettings
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const updateRestaurant = async (updatedRestaurant: Restaurant) => {
    try {
      // Map the restaurant data to match Supabase column names
      const { data, error } = await supabase
        .from('restaurants')
        .update({
          name: updatedRestaurant.name,
          address: updatedRestaurant.address,
          contact_email: updatedRestaurant.contactEmail,
          contact_phone: updatedRestaurant.contactPhone,
          logo_url: updatedRestaurant.logoUrl,
          theme_id: updatedRestaurant.themeId,
          theme_settings: updatedRestaurant.themeSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedRestaurant.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Properly handle themeSettings from response data
      let themeSettings = {
        primary: '#0f172a',
        secondary: '#e5e7eb',
        accent: '#3b82f6',
        background: '#ffffff'
      };

      if (data.theme_settings && typeof data.theme_settings === 'object') {
        // Type assertion and handle each property safely
        const themeObject = data.theme_settings as Record<string, any>;
        themeSettings = {
          primary: typeof themeObject.primary === 'string' ? themeObject.primary : themeSettings.primary,
          secondary: typeof themeObject.secondary === 'string' ? themeObject.secondary : themeSettings.secondary,
          accent: typeof themeObject.accent === 'string' ? themeObject.accent : themeSettings.accent,
          background: typeof themeObject.background === 'string' ? themeObject.background : themeSettings.background
        };
      }

      // Update local state with the returned data and proper typing
      const updatedData: Restaurant = {
        id: data.id,
        name: data.name,
        address: data.address,
        contactEmail: data.contact_email,
        contactPhone: data.contact_phone,
        logoUrl: data.logo_url,
        themeId: data.theme_id,
        themeSettings: themeSettings
      };

      setRestaurant(updatedData);
      
      toast({
        title: "Restaurant Updated",
        description: "Restaurant details have been successfully updated"
      });
      
      return updatedData;
    } catch (err) {
      console.error('Error updating restaurant:', err);
      
      toast({
        title: "Update Failed",
        description: "Failed to update restaurant details",
        variant: "destructive"
      });
      
      setError(err instanceof Error ? err : new Error('Failed to update restaurant'));
      throw err;
    }
  };

  return { restaurant, isLoading, error, updateRestaurant };
};
