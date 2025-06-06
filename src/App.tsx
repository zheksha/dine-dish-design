
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Customer facing pages
import MenuPage from "./pages/MenuPage";
import MenuItemPage from "./pages/MenuItemPage";
import FavoritesPage from "./pages/FavoritesPage";
import DealsPage from "./pages/DealsPage";
import AuthPage from "./pages/AuthPage";

// Admin dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import RestaurantPage from "./pages/dashboard/RestaurantPage";
import MenuManagementPage from "./pages/dashboard/MenuPage";
import DealsManagementPage from "./pages/dashboard/DealsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <FavoritesProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Authentication Route */}
                    <Route path="/auth" element={<AuthPage />} />
                    
                    {/* Customer Routes */}
                    <Route path="/" element={<MenuPage />} />
                    <Route path="/menu/:itemId" element={<MenuItemPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/deals" element={<DealsPage />} />
                    
                    {/* Admin Dashboard Routes - No longer protected */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/restaurant" element={<RestaurantPage />} />
                    <Route path="/dashboard/menu" element={<MenuManagementPage />} />
                    <Route path="/dashboard/deals" element={<DealsManagementPage />} />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
              </FavoritesProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
