
import React from 'react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Button } from "@/components/ui/button";
import { Heart, Plus, Minus } from "lucide-react";

interface MenuItemCardProps {
  menuItem: MenuItem;
  onClick?: () => void;
  compact?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItem, onClick, compact = false }) => {
  const { addItem, removeItem, cart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  const favorite = isFavorite(menuItem.id || '');
  
  // Find item in cart to display quantity
  const cartItem = cart.items.find(item => item.menuItem.id === menuItem.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(menuItem);
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(menuItem.id || '');
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(menuItem.id || '');
    } else {
      addFavorite(menuItem.id || '');
    }
  };

  if (compact) {
    return (
      <div 
        className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card text-card-foreground menu-card-hover cursor-pointer flex"
        onClick={onClick}
      >
        {menuItem.imageUrl && (
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={menuItem.imageUrl} 
              alt={menuItem.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-grow p-3 flex justify-between">
          <div>
            <h3 className="font-medium text-base truncate">{menuItem.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {menuItem.description}
            </p>
            <span className="font-medium text-sm text-primary">${menuItem.price.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col justify-between items-end">
            <button 
              onClick={handleFavoriteToggle}
              className="p-1 bg-background/80 rounded-full backdrop-blur-sm"
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={`h-4 w-4 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} 
              />
            </button>
            
            {menuItem.available ? (
              <div className="flex items-center mt-2">
                {quantity > 0 ? (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full p-0"
                      onClick={handleRemoveFromCart}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 text-sm font-medium w-4 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full p-0"
                      onClick={handleAddToCart}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 rounded-full p-0"
                    onClick={handleAddToCart}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ) : (
              <span className="text-xs text-destructive">Sold Out</span>
            )}
          </div>
        </div>
      </div>
    );
  }

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
          {menuItem.available ? (
            quantity > 0 ? (
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRemoveFromCart}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-2 font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddToCart}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddToCart}
              >
                <Plus className="h-4 w-4 mr-1" /> Add to Cart
              </Button>
            )
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled
            >
              Sold Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
