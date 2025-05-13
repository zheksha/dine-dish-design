
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useRestaurant } from '../hooks/useRestaurant';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { 
  Menu, 
  Settings, 
  BookOpen, 
  Tag, 
  Home,
  ChevronLeft, 
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { restaurant } = useRestaurant();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!restaurant) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const navItems = [
    { path: '/dashboard', label: t('dashboard'), icon: Home },
    { path: '/dashboard/restaurant', label: t('restaurant'), icon: Settings },
    { path: '/dashboard/menu', label: t('menuManagement'), icon: BookOpen },
    { path: '/dashboard/deals', label: t('dealsPromotions'), icon: Tag }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
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
              {restaurant.logoUrl ? (
                <img 
                  src={restaurant.logoUrl} 
                  alt={restaurant.name} 
                  className="h-8 w-8 object-contain rounded-md" 
                />
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(restaurant.name)}
                  </AvatarFallback>
                </Avatar>
              )}
              <h1 className="font-bold truncate">{restaurant.name}</h1>
            </Link>
          )}
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
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
                      ? 'bg-primary/10 text-primary' 
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
            {isSidebarOpen ? (
              <div className="flex gap-2">
                <ThemeSwitcher />
                <LanguageSelector />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <ThemeSwitcher />
                <LanguageSelector />
              </div>
            )}
            {isSidebarOpen && <span>{t('theme')}</span>}
          </div>
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mt-1`}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span>{t('backToMenu')}</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-grow ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300 ease-in-out`}>
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              {restaurant.logoUrl ? (
                <img 
                  src={restaurant.logoUrl} 
                  alt={restaurant.name} 
                  className="h-8 w-8 object-contain rounded-md" 
                />
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(restaurant.name)}
                  </AvatarFallback>
                </Avatar>
              )}
              <h1 className="font-bold truncate">{restaurant.name}</h1>
            </Link>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost" 
                    size="icon"
                    className="rounded-full"
                    aria-label="User menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            <nav className="border-t">
              <ul>
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center gap-2 px-4 py-3 ${
                        isActive(item.path) 
                          ? 'bg-primary/10 text-primary' 
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
                    <LanguageSelector />
                    <span>{t('theme')}</span>
                  </div>
                  <Link 
                    to="/" 
                    className="text-primary hover:underline"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('backToMenu')}
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </header>
        
        {/* Desktop header with user menu */}
        <header className="hidden md:flex sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b h-16 items-center justify-end px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block">{user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
