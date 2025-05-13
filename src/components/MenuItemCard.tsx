
import React from 'react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface MenuItemCardProps {
  menuItem: MenuItem;
  onClick?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItem, onClick }) => {
  const { addItem } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  const favorite = isFavorite(menuItem.id || '');
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(menuItem);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(menuItem.id || '');
    } else {
      addFavorite(menuItem.id || '');
    }
  };

  return (
    <div 
      className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card text-card-foreground menu-card-hover cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {menuItem.imageUrl ? (
          <img 
            src={menuItem.imageUrl} 
            alt={menuItem.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      
      <button 
        onClick={handleFavoriteToggle}
        className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full backdrop-blur-sm"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          className={`h-5 w-5 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} 
        />
      </button>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{menuItem.name}</h3>
          <span className="font-medium text-primary">${menuItem.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {menuItem.description}
        </p>
        
        <div className="mb-4">
          <span className={`food-tag ${menuItem.type}`}>
            {menuItem.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
          </span>
          {menuItem.tags.map(tag => (
            <span key={tag} className={`food-tag ${tag}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
            disabled={!menuItem.available}
          >
            {menuItem.available ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
