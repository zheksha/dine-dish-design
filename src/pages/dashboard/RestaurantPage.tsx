import React, { useState } from 'react';
import { useRestaurant } from '../../hooks/useRestaurant';
import DashboardLayout from '../../layouts/DashboardLayout';
import ThemeManager from '../../components/dashboard/ThemeManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RestaurantPage: React.FC = () => {
  const { restaurant, isLoading, updateRestaurant } = useRestaurant();
  const [activeTab, setActiveTab] = useState("details");

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
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            {/* Original Restaurant details form goes here */}
            <p>Restaurant details form...</p>
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
