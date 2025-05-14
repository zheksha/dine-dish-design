
import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../hooks/useRestaurant';
import DashboardLayout from '../../layouts/DashboardLayout';
import ThemeManager from '../../components/dashboard/ThemeManager';
import RestaurantDetails from '../../components/dashboard/RestaurantDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation, useNavigate } from 'react-router-dom';

const RestaurantPage: React.FC = () => {
  const { restaurant, isLoading } = useRestaurant();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  
  // Parse tab from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab && (tab === 'details' || tab === 'appearance')) {
      setActiveTab(tab);
    }
  }, [location.search]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`?tab=${value}`, { replace: true });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <p>Loading restaurant data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Restaurant Settings</h1>
          <p className="text-muted-foreground">
            Manage your restaurant's information and appearance
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <RestaurantDetails />
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <ThemeManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RestaurantPage;
