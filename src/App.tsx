
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

// Customer facing pages
import MenuPage from "./pages/MenuPage";
import MenuItemPage from "./pages/MenuItemPage";
import FavoritesPage from "./pages/FavoritesPage";
import DealsPage from "./pages/DealsPage";

// Admin dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import RestaurantPage from "./pages/dashboard/RestaurantPage";
import MenuManagementPage from "./pages/dashboard/MenuPage";
import DealsManagementPage from "./pages/dashboard/DealsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CartProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<MenuPage />} />
                <Route path="/menu/:itemId" element={<MenuItemPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/deals" element={<DealsPage />} />
                
                {/* Admin Dashboard Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/restaurant" element={<RestaurantPage />} />
                <Route path="/dashboard/menu" element={<MenuManagementPage />} />
                <Route path="/dashboard/deals" element={<DealsManagementPage />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FavoritesProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
