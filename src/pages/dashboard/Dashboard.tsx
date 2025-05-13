
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';
import { useDeals } from '../../hooks/useDeals';
import { useRestaurant } from '../../hooks/useRestaurant';
import { useLanguage } from '../../context/LanguageContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Settings, BookOpen, Tag, Home } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { restaurant } = useRestaurant();
  const { categories, menuItems } = useMenu();
  const { deals } = useDeals();
  const { t } = useLanguage();
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

  const placeholderImage = "/placeholder.svg";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('dashboard')}</h1>
          <p className="text-muted-foreground">
            {t('manageYourRestaurant')}
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('menuItems')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMenuItems}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {availableItems} {t('available')} • {unavailableItems} {t('unavailable')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('categories')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCategories}</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('totalDeals')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalDeals}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeDeals} {t('activeDeals')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('restaurant')}
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
          <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-2 bg-blue-500"></div>
            <CardHeader>
              <CardTitle>{t('restaurantDetails')}</CardTitle>
              <CardDescription>
                {t('updateProfile')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <Button 
                variant="outline" 
                className="w-full justify-between border-dashed"
                onClick={() => navigate('/dashboard/restaurant')}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>{t('manageRestaurant')}</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-2 bg-green-500"></div>
            <CardHeader>
              <CardTitle>{t('menuManagement')}</CardTitle>
              <CardDescription>
                {t('updateProfile')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <Button 
                variant="outline" 
                className="w-full justify-between border-dashed"
                onClick={() => navigate('/dashboard/menu')}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{t('manageMenu')}</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-2 bg-amber-500"></div>
            <CardHeader>
              <CardTitle>{t('dealsPromotions')}</CardTitle>
              <CardDescription>
                {t('updateProfile')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <Button 
                variant="outline" 
                className="w-full justify-between border-dashed"
                onClick={() => navigate('/dashboard/deals')}
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>{t('manageDeals')}</span>
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
