
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import CustomerLayout from '../layouts/CustomerLayout';
import { MenuItem } from '../types';
import { 
  ArrowLeft, 
  Heart, 
  Plus, 
  Minus, 
  ShoppingCart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import MenuItemCard from '../components/MenuItemCard';

// Ingredient emojis map
const ingredientEmojis: Record<string, string> = {
  'tomato': '🍅',
  'lettuce': '🥬',
  'cheese': '🧀',
  'onion': '🧅',
  'garlic': '🧄',
  'chicken': '🍗',
  'beef': '🥩',
  'pork': '🥓',
  'fish': '🐟',
  'shrimp': '🍤',
  'rice': '🍚',
  'pasta': '🍝',
  'potato': '🥔',
  'egg': '🥚',
  'milk': '🥛',
  'butter': '🧈',
  'bread': '🍞',
  'salt': '🧂',
  'pepper': '🌶️',
  'olive oil': '🫒',
  'mushroom': '🍄',
  'carrot': '🥕',
  'cucumber': '🥒',
  'avocado': '🥑',
  'lemon': '🍋',
  'lime': '🍋',
  'orange': '🍊',
  'apple': '🍎',
  'banana': '🍌',
  'strawberry': '🍓',
  'blueberry': '🫐',
  'watermelon': '🍉',
  'grapes': '🍇',
  'pineapple': '🍍',
  'corn': '🌽',
  'chili': '🌶️',
  'ginger': '🫚',
  'cinnamon': '🌰',
  'chocolate': '🍫',
  'honey': '🍯',
  'soy sauce': '🍶',
  'vinegar': '🧪',
  'flour': '🌾',
  'sugar': '🍬',
  'water': '💧',
  'oil': '🛢️',
  'nuts': '🥜',
  'almond': '🥜',
  'walnut': '🌰',
  'basil': '🌿',
  'parsley': '🌿',
  'mint': '🌿',
  'oregano': '🌿',
  'thyme': '🌿',
  'rosemary': '🌿',
  'spinach': '🥬',
  'cabbage': '🥬',
  'broccoli': '🥦',
  'cauliflower': '🥦',
  'bell pepper': '🫑',
  'zucchini': '🥬',
  'eggplant': '🍆',
  'pumpkin': '🎃',
  'beans': '🫘',
  'peas': '🫛',
  'yogurt': '🥣',
  'cream': '🍶',
  'wine': '🍷',
  'beer': '🍺'
};

const MenuItemPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { menuItems, categories } = useMenu();
  const { addItem, removeItem, cart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
  
  // Find menu item by ID
  useEffect(() => {
    if (itemId) {
      const foundItem = menuItems.find(item => item.id === itemId);
      if (foundItem) {
        setMenuItem(foundItem);
        
        // Find related items in the same category
        const categoryItems = menuItems
          .filter(item => item.categoryId === foundItem.categoryId && item.id !== foundItem.id)
          .slice(0, 3);
          
        setRelatedItems(categoryItems);
        
        // Check if the item is already in cart and set the quantity
        const cartItem = cart.items.find(item => item.menuItem.id === foundItem.id);
        if (cartItem) {
          setQuantity(cartItem.quantity);
        } else {
          setQuantity(1);
        }
      }
    }
  }, [itemId, menuItems, cart.items]);
  
  if (!menuItem) {
    return (
      <CustomerLayout>
        <div className="layout-container py-16">
          <div className="text-center">
            <p>Menu item not found</p>
            <Button 
              variant="link" 
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Back to menu
            </Button>
          </div>
        </div>
      </CustomerLayout>
    );
  }
  
  const favorite = isFavorite(menuItem.id || '');
  
  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFavorite(menuItem.id || '');
    } else {
      addFavorite(menuItem.id || '');
    }
  };
  
  const handleAddToCart = () => {
    // Get current quantity in cart
    const cartItem = cart.items.find(item => item.menuItem.id === menuItem.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    
    // If the desired quantity is greater than current quantity, add items
    if (quantity > currentQuantity) {
      for (let i = 0; i < (quantity - currentQuantity); i++) {
        addItem(menuItem);
      }
    } 
    // If desired quantity is less than current quantity, remove items
    else if (quantity < currentQuantity) {
      // Remove all and add the correct amount
      removeItem(menuItem.id || '');
      for (let i = 0; i < quantity; i++) {
        addItem(menuItem);
      }
    }
    // If equal, do nothing
  };
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  
  // Get emoji for ingredient
  const getIngredientWithEmoji = (ingredient: string) => {
    const lowerIngredient = ingredient.toLowerCase();
    
    // Check if there's a direct match
    if (ingredientEmojis[lowerIngredient]) {
      return `${ingredientEmojis[lowerIngredient]} ${ingredient}`;
    }
    
    // Check for partial matches
    for (const [key, emoji] of Object.entries(ingredientEmojis)) {
      if (lowerIngredient.includes(key) || key.includes(lowerIngredient)) {
        return `${emoji} ${ingredient}`;
      }
    }
    
    // Default emoji for ingredients without matches
    return `🍴 ${ingredient}`;
  };
  
  // Find category name
  const categoryName = categories.find(cat => cat.id === menuItem.categoryId)?.name || '';

  return (
    <CustomerLayout>
      <div className="layout-container py-8">
        <Button
          variant="ghost"
          className="group mb-6 flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Menu</span>
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {menuItem.imageUrl ? (
              <img 
                src={menuItem.imageUrl} 
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>
          
          {/* Details */}
          <div>
            <div className="mb-2 text-sm text-muted-foreground">
              {categoryName}
            </div>
            
            <h1 className="text-3xl font-semibold mb-2">{menuItem.name}</h1>
            
            <div className="text-2xl font-medium text-primary mb-4">
              ${menuItem.price.toFixed(2)}
            </div>
            
            <div className="mb-6">
              <span className={`food-tag ${menuItem.type}`}>
                {menuItem.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
              {menuItem.tags.map(tag => (
                <span key={tag} className={`food-tag ${tag}`}>{tag}</span>
              ))}
            </div>
            
            <p className="text-lg mb-6">{menuItem.description}</p>
            
            {menuItem.ingredients && menuItem.ingredients.length > 0 && (
              <div className="mb-6">
                <h2 className="font-medium text-lg mb-2">Ingredients</h2>
                <ul className="list-none text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-1">
                  {menuItem.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center">
                      {getIngredientWithEmoji(ingredient)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {menuItem.available ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={decrementQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </Button>
                  
                  <Button
                    variant="outline" 
                    size="icon"
                    onClick={handleFavoriteToggle}
                    className={favorite ? "text-rose-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${favorite ? "fill-rose-500" : ""}`} />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-destructive/10 text-destructive py-2 px-4 rounded-md mb-4">
                Currently unavailable
              </div>
            )}
          </div>
        </div>
        
        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-6" />
            <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map(item => (
                <MenuItemCard 
                  key={item.id} 
                  menuItem={item} 
                  onClick={() => navigate(`/menu/${item.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default MenuItemPage;
