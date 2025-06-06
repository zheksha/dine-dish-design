
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import CustomerLayout from '../layouts/CustomerLayout';
import MenuItemCard from '../components/MenuItemCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { MenuItem } from '../types';

const FavoritesPage: React.FC = () => {
  const { favorites, getFavoriteItems } = useFavorites();
  const navigate = useNavigate();
  const [favoriteItems, setFavoriteItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      // Log for debugging
      console.log("Favorites page - Current favorites:", favorites);
      
      const items = getFavoriteItems();
      console.log("Favorite items retrieved:", items.length);
      setFavoriteItems(items);
      setError(null);
    } catch (err) {
      console.error("Error loading favorites:", err);
      setError("Failed to load favorite items");
      toast({
        title: "Error",
        description: "Failed to load your favorites",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [favorites, getFavoriteItems]);

  const handleMenuItemClick = (itemId: string) => {
    try {
      if (itemId) {
        navigate(`/menu/${itemId}`);
      }
    } catch (error) {
      console.error("Error navigating to item:", error);
      toast({
        title: "Error",
        description: "Could not navigate to item details",
        variant: "destructive"
      });
    }
  };
  
  return (
    <CustomerLayout>
      <div className="layout-container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-6 w-6 text-rose-500" />
          <h1 className="text-2xl font-semibold">Your Favorites</h1>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center">
            <p>Loading your favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Add items to your favorites to see them here.
            </p>
            <Button onClick={() => navigate('/')}>
              Browse Menu
            </Button>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-xl font-medium mb-2">Could not load favorites</h2>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <Button onClick={() => navigate('/')}>
              Browse Menu
            </Button>
          </div>
        ) : favoriteItems.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-xl font-medium mb-2">No favorite items found</h2>
            <p className="text-muted-foreground mb-6">
              The items you favorited may no longer be available.
            </p>
            <Button onClick={() => navigate('/')}>
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteItems.map(item => (
              <MenuItemCard 
                key={item.id} 
                menuItem={item} 
                onClick={() => handleMenuItemClick(item.id || '')}
              />
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default FavoritesPage;
