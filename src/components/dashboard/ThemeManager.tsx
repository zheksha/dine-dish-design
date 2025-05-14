
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Palette, Brush, Check, RefreshCw, Eye } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRestaurant } from '@/hooks/useRestaurant';

// Predefined color themes - improved with better combinations for light/dark mode
const predefinedThemes = [
  {
    id: 'default-light',
    name: 'Default Light',
    primary: '#0f172a',
    secondary: '#e5e7eb',
    accent: '#3b82f6',
    background: '#ffffff',
    preview: 'bg-white border-gray-200'
  },
  {
    id: 'default-dark',
    name: 'Default Dark',
    primary: '#f8fafc',
    secondary: '#334155',
    accent: '#60a5fa',
    background: '#0f172a',
    preview: 'bg-gray-900 border-gray-700'
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    primary: '#4b3621',
    secondary: '#d4c1a5',
    accent: '#8b5a2b',
    background: '#f5f5dc',
    preview: 'bg-[#f5f5dc] border-[#d4c1a5]'
  },
  {
    id: 'seafood',
    name: 'Seafood',
    primary: '#05445E',
    secondary: '#D4F1F9',
    accent: '#189AB4',
    background: '#f8f9fa',
    preview: 'bg-[#f8f9fa] border-[#D4F1F9]'
  },
  {
    id: 'italian',
    name: 'Italian',
    primary: '#3c1518',
    secondary: '#f2e8c6',
    accent: '#69140e',
    background: '#fbfbf2',
    preview: 'bg-[#fbfbf2] border-[#f2e8c6]'
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    primary: '#2d3e40',
    secondary: '#e9f5db',
    accent: '#76c893',
    background: '#f8f9fa',
    preview: 'bg-[#f8f9fa] border-[#e9f5db]'
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    primary: '#e2e8f0',
    secondary: '#1e293b',
    accent: '#8b5cf6',
    background: '#0f172a',
    preview: 'bg-[#0f172a] border-[#1e293b]'
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    primary: '#18181b',
    secondary: '#f4f4f5',
    accent: '#06b6d4',
    background: '#ffffff',
    preview: 'bg-[#ffffff] border-[#f4f4f5]'
  }
];

const ThemeManager: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { restaurant, updateRestaurant } = useRestaurant();
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  
  // Find current theme from restaurant settings or default to first theme
  const getCurrentThemeId = () => {
    return restaurant?.themeId || 'default-light';
  };

  // Find theme by ID
  const getThemeById = (themeId: string) => {
    return predefinedThemes.find(t => t.id === themeId) || predefinedThemes[0];
  };

  // Apply theme settings from restaurant on component mount
  useEffect(() => {
    if (restaurant?.themeSettings) {
      const themeSettings = restaurant.themeSettings;
      
      // Apply theme settings from database to CSS variables
      document.documentElement.style.setProperty('--primary', themeSettings.primary);
      document.documentElement.style.setProperty('--secondary', themeSettings.secondary);
      document.documentElement.style.setProperty('--accent', themeSettings.accent);
      document.documentElement.style.setProperty('--background', themeSettings.background);
      
      // Set preview theme based on restaurant theme ID
      if (restaurant.themeId) {
        setPreviewTheme(restaurant.themeId);
      }
    }
  }, [restaurant?.themeSettings, restaurant?.themeId]);

  const handleThemeChange = (themeName: 'light' | 'dark' | 'system') => {
    setTheme(themeName);
    toast({
      title: 'Theme Mode Updated',
      description: `Theme mode set to ${themeName}`,
    });
  };

  const applyPredefinedTheme = async (selectedTheme: any) => {
    if (!restaurant) return;
    
    setIsApplying(true);
    setPreviewTheme(selectedTheme.id);
    
    // Set CSS variables
    document.documentElement.style.setProperty('--primary', selectedTheme.primary);
    document.documentElement.style.setProperty('--secondary', selectedTheme.secondary);
    document.documentElement.style.setProperty('--accent', selectedTheme.accent);
    document.documentElement.style.setProperty('--background', selectedTheme.background);
    
    try {
      // Save theme to database
      await updateRestaurant({
        ...restaurant,
        themeId: selectedTheme.id,
        themeSettings: {
          primary: selectedTheme.primary,
          secondary: selectedTheme.secondary,
          accent: selectedTheme.accent,
          background: selectedTheme.background
        }
      });
      
      toast({
        title: 'Theme Applied',
        description: `${selectedTheme.name} theme has been applied and saved`,
      });
    } catch (error) {
      console.error("Error saving theme:", error);
      toast({
        title: 'Error',
        description: 'Failed to save theme settings',
        variant: 'destructive'
      });
      
      // Reset preview in case of error
      resetPreview();
    } finally {
      setIsApplying(false);
    }
  };

  const resetPreview = () => {
    if (!restaurant?.themeSettings) return;
    
    // Reset to current restaurant theme
    setPreviewTheme(restaurant.themeId || null);
    
    const themeSettings = restaurant.themeSettings;
    document.documentElement.style.setProperty('--primary', themeSettings.primary);
    document.documentElement.style.setProperty('--secondary', themeSettings.secondary);
    document.documentElement.style.setProperty('--accent', themeSettings.accent);
    document.documentElement.style.setProperty('--background', themeSettings.background);
    
    toast({
      title: 'Theme Reset',
      description: 'Theme reset to current settings'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" /> Theme Mode
          </CardTitle>
          <CardDescription>
            Choose between light, dark or system theme preference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            defaultValue={theme} 
            onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')} 
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brush className="h-5 w-5" /> Color Themes
          </CardTitle>
          <CardDescription>
            Choose from predefined color themes for your restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current theme indicator */}
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
              <div className="text-sm font-medium flex items-center gap-2">
                <span>Current theme:</span>
                <span className="font-semibold">{getThemeById(getCurrentThemeId()).name}</span>
              </div>
            </div>

            {/* Theme grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {predefinedThemes.map((themeOption) => {
                const isCurrentTheme = restaurant?.themeId === themeOption.id;
                const isPreview = previewTheme === themeOption.id;
                return (
                  <div 
                    key={themeOption.id}
                    className={`border rounded-lg overflow-hidden hover:shadow-md transition-all ${
                      isCurrentTheme ? 'ring-2 ring-accent' : ''
                    }`}
                  >
                    {/* Theme preview */}
                    <div 
                      className={`h-32 ${themeOption.preview} border-b relative`}
                      style={{
                        backgroundColor: themeOption.background,
                        borderColor: themeOption.secondary
                      }}
                    >
                      {/* Theme color preview - buttons and UI elements */}
                      <div className="absolute inset-0 flex flex-col items-start justify-between p-3">
                        <div 
                          className="rounded-md px-2 py-1 text-xs" 
                          style={{
                            backgroundColor: themeOption.primary,
                            color: themeOption.background
                          }}
                        >
                          Header
                        </div>
                        
                        <div className="w-full flex justify-between items-center">
                          <div 
                            className="rounded-full h-4 w-20" 
                            style={{
                              backgroundColor: themeOption.secondary
                            }}
                          ></div>
                          
                          <div 
                            className="rounded-md px-2 py-1 text-xs" 
                            style={{
                              backgroundColor: themeOption.accent,
                              color: '#fff'
                            }}
                          >
                            Button
                          </div>
                        </div>
                      </div>
                      
                      {/* Theme color swatches */}
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: themeOption.primary }} />
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: themeOption.secondary }} />
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: themeOption.accent }} />
                      </div>
                    </div>
                    
                    {/* Theme name and apply button */}
                    <div className="p-3 flex items-center justify-between">
                      <span className="font-medium">{themeOption.name}</span>
                      <Button 
                        size="sm" 
                        variant={isCurrentTheme ? "secondary" : "outline"}
                        onClick={() => applyPredefinedTheme(themeOption)}
                        disabled={isApplying}
                      >
                        {isCurrentTheme ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Eye className="h-4 w-4 mr-1" />
                        )}
                        {isCurrentTheme ? 'Current' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeManager;
