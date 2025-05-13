
import React, { useState } from 'react';
import { useRestaurant } from '../hooks/useRestaurant';
import { useCart } from '../context/CartContext';
import ThemeSwitcher from '../components/ThemeSwitcher';
import Cart from '../components/Cart';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { restaurant } = useRestaurant();
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!restaurant) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="layout-container py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              {restaurant.logoUrl && (
                <img 
                  src={restaurant.logoUrl} 
                  alt={restaurant.name} 
                  className="h-8 w-8 object-contain" 
                />
              )}
              <h1 className="text-xl font-bold">{restaurant.name}</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <nav>
                <ul className="flex items-center gap-6">
                  <li>
                    <Link to="/" className="text-foreground hover:text-primary transition-colors">
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" className="text-foreground hover:text-primary transition-colors">
                      Favorites
                    </Link>
                  </li>
                  <li>
                    <Link to="/deals" className="text-foreground hover:text-primary transition-colors">
                      Deals
                    </Link>
                  </li>
                </ul>
              </nav>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cart.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cart.totalItems}
                    </span>
                  )}
                </Button>
                
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.totalItems}
                  </span>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="pt-2 pb-4 md:hidden border-t mt-2">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/" 
                    className="block p-2 hover:bg-secondary rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Menu
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/favorites" 
                    className="flex items-center gap-2 p-2 hover:bg-secondary rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" /> Favorites
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/deals" 
                    className="block p-2 hover:bg-secondary rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Deals
                  </Link>
                </li>
                <li className="flex items-center gap-2 p-2">
                  <ThemeSwitcher />
                  <span>Theme</span>
                </li>
                <li>
                  <Link 
                    to="/dashboard" 
                    className="block p-2 hover:bg-secondary rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="layout-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-3">{restaurant.name}</h3>
              <address className="not-italic text-muted-foreground">
                {restaurant.address}<br />
                {restaurant.contactPhone && <div>{restaurant.contactPhone}</div>}
                <a 
                  href={`mailto:${restaurant.contactEmail}`}
                  className="text-primary hover:underline"
                >
                  {restaurant.contactEmail}
                </a>
              </address>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link to="/favorites" className="text-muted-foreground hover:text-primary">
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link to="/deals" className="text-muted-foreground hover:text-primary">
                    Deals
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3">Admin</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-primary">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/menu" className="text-muted-foreground hover:text-primary">
                    Menu Management
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {restaurant.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default CustomerLayout;
