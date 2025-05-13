
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';
import { useDeals } from '../../hooks/useDeals';
import { useRestaurant } from '../../hooks/useRestaurant';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Settings, BookOpen, Tag } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { restaurant } = useRestaurant();
  const { categories, menuItems } = useMenu();
  const { deals } = useDeals();
  const navigate = useNavigate();
  
  const totalMenuItems = menuItems.length;
  const totalCategories = categories.length;
  const totalDeals = deals.length;
  
  const availableItems = menuItems.filter(item => item.available).length;
  const unavailableItems = totalMenuItems - availableItems;
  
  const activeDeals = deals.filter(deal => {
    const now = new Date();
    return new Date(deal.validFrom) <= now && new Date(deal.validTo) >= now;
  }).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your restaurant, menu items, and special deals.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Menu Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMenuItems}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {availableItems} available • {unavailableItems} unavailable
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCategories}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalDeals}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeDeals} active deals
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Restaurant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{restaurant?.name}</div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {restaurant?.address}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Details</CardTitle>
              <CardDescription>
                Update your restaurant profile, contact info, and branding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/dashboard/restaurant')}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Manage Restaurant</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Menu Management</CardTitle>
              <CardDescription>
                Manage your menu categories, food items, and availability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/dashboard/menu')}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Manage Menu</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Deals & Promotions</CardTitle>
              <CardDescription>
                Create and manage special deals, discounts and promotions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/dashboard/deals')}
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>Manage Deals</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
