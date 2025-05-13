
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative bg-card w-full max-w-md sm:rounded-lg shadow-lg animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Your Cart
          </h2>
          <button
            className="p-1 rounded-md hover:bg-secondary"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button variant="outline" className="mt-4" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[50vh]">
              <div className="p-4 space-y-4">
                {cart.items.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center gap-3 pb-3 border-b">
                    {item.menuItem.imageUrl && (
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.menuItem.imageUrl} 
                          alt={item.menuItem.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.menuItem.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        ${item.menuItem.price.toFixed(2)} each
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.menuItem.id!, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-6 text-center">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.menuItem.id!, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2 text-muted-foreground"
                        onClick={() => removeItem(item.menuItem.id!)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 space-y-4 border-t">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button className="flex-1">Checkout</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
