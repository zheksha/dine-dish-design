
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useRestaurant } from '../hooks/useRestaurant';
import { 
  Menu, 
  Settings, 
  BookOpen, 
  Tag, 
  Home,
  ChevronLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { restaurant } = useRestaurant();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!restaurant) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/dashboard/restaurant', label: 'Restaurant', icon: Settings },
    { path: '/dashboard/menu', label: 'Menu', icon: BookOpen },
    { path: '/dashboard/deals', label: 'Deals', icon: Tag }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-sidebar fixed h-full border-r hidden md:block transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {isSidebarOpen && (
            <Link to="/dashboard" className="flex items-center gap-2">
              {restaurant.logoUrl && (
                <img 
                  src={restaurant.logoUrl} 
                  alt={restaurant.name} 
                  className="h-8 w-8 object-contain" 
                />
              )}
              <h1 className="font-bold truncate">{restaurant.name}</h1>
            </Link>
          )}
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <Separator />
        
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    isActive(item.path) 
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-2 border-t">
          <div className="flex items-center justify-between px-3 py-2">
            <ThemeSwitcher />
            {isSidebarOpen && <span>Theme</span>}
          </div>
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mt-1`}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span>Back to Menu</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-grow ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300 ease-in-out`}>
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              {restaurant.logoUrl && (
                <img 
                  src={restaurant.logoUrl} 
                  alt={restaurant.name} 
                  className="h-8 w-8 object-contain" 
                />
              )}
              <h1 className="font-bold truncate">{restaurant.name}</h1>
            </Link>
            <Button
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="border-t">
              <ul>
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center gap-2 px-4 py-3 ${
                        isActive(item.path) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-foreground hover:bg-secondary'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                
                <li className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <span>Theme</span>
                  </div>
                  <Link 
                    to="/" 
                    className="text-primary hover:underline"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Back to Menu
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
