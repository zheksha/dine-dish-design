
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { MenuItem } from '../types';
import CustomerLayout from '../layouts/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeOneFromCart, selectCartItemQuantity } from '../store/cartSlice';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const MenuItemPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { menuItems } = useMenu();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const dispatch = useDispatch();
  
  const quantity = useSelector((state: any) => 
    selectCartItemQuantity(state, itemId || '')
  );

  useEffect(() => {
    if (menuItems.length > 0 && itemId) {
      const item = menuItems.find(item => item.id === itemId);
      if (item) {
        setMenuItem(item);
      }
    }
  }, [menuItems, itemId]);

  const handleAddToCart = () => {
    if (menuItem) {
      dispatch(addToCart(menuItem));
      toast({
        title: "Added to cart",
        description: `${menuItem.name} added to your order`
      });
    }
  };

  const handleRemoveFromCart = () => {
    if (menuItem && quantity > 0) {
      dispatch(removeOneFromCart(menuItem.id || ''));
    }
  };

  if (!menuItem) {
    return (
      <CustomerLayout>
        <div className="text-center py-16">
          <p>Loading menu item...</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link to="/menu">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Item Image */}
          <div className="bg-muted rounded-lg overflow-hidden h-64 md:h-auto">
            {menuItem.imageUrl ? (
              <img 
                src={menuItem.imageUrl} 
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>
          
          {/* Item Details */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{menuItem.name}</h1>
              <p className="text-2xl font-medium mt-2">${menuItem.price.toFixed(2)}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant={menuItem.type === 'veg' ? 'secondary' : 'outline'}>
                {menuItem.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
              </Badge>
              
              {menuItem.tags && menuItem.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <p className="text-muted-foreground">{menuItem.description}</p>
            
            {/* Ingredients with emojis */}
            {menuItem.ingredients && menuItem.ingredients.length > 0 && (
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                <Card>
                  <CardContent className="p-4">
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {menuItem.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center text-md">
                          <span className="mr-2 text-lg">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex items-center">
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon"
                  disabled={quantity === 0}
                  onClick={handleRemoveFromCart}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleAddToCart}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                className="ml-4"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default MenuItemPage;
