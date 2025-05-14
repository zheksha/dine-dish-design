
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Palette, Brush, Check, RefreshCw, Eye } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Predefined color themes
const predefinedThemes = [
  {
    name: 'Default Light',
    primary: '#0f172a',
    secondary: '#e5e7eb',
    accent: '#3b82f6',
    background: '#ffffff',
    preview: 'bg-white border-gray-200'
  },
  {
    name: 'Default Dark',
    primary: '#f8fafc',
    secondary: '#334155',
    accent: '#60a5fa',
    background: '#0f172a',
    preview: 'bg-gray-900 border-gray-700'
  },
  {
    name: 'Coffee Shop',
    primary: '#4b3621',
    secondary: '#d4c1a5',
    accent: '#8b5a2b',
    background: '#f5f5dc',
    preview: 'bg-[#f5f5dc] border-[#d4c1a5]'
  },
  {
    name: 'Seafood',
    primary: '#05445E',
    secondary: '#D4F1F9',
    accent: '#189AB4',
    background: '#f8f9fa',
    preview: 'bg-[#f8f9fa] border-[#D4F1F9]'
  },
  {
    name: 'Italian',
    primary: '#3c1518',
    secondary: '#f2e8c6',
    accent: '#69140e',
    background: '#fbfbf2',
    preview: 'bg-[#fbfbf2] border-[#f2e8c6]'
  },
  {
    name: 'Vegetarian',
    primary: '#2d3e40',
    secondary: '#e9f5db',
    accent: '#76c893',
    background: '#f8f9fa',
    preview: 'bg-[#f8f9fa] border-[#e9f5db]'
  }
];

const ThemeManager: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const handleThemeChange = (themeName: 'light' | 'dark' | 'system') => {
    setTheme(themeName);
    toast({
      title: 'Theme Updated',
      description: `Theme set to ${themeName}`,
    });
  };

  const applyPredefinedTheme = (theme: any) => {
    // Preview logic - we don't actually change the theme yet
    setPreviewTheme(theme.name);
    
    // Set CSS variables
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--background', theme.background);
    
    toast({
      title: 'Theme Applied',
      description: `${theme.name} theme has been applied`,
    });
  };

  const resetPreview = () => {
    // Reset to current theme
    setPreviewTheme(null);
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--secondary');
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--background');
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
            {previewTheme && (
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                <div className="text-sm font-medium">
                  Current theme: {previewTheme}
                </div>
                <Button size="sm" variant="outline" onClick={resetPreview}>
                  <RefreshCw className="h-4 w-4 mr-1" /> Reset
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {predefinedThemes.map((themeOption) => (
                <div 
                  key={themeOption.name}
                  className={`border rounded-lg overflow-hidden hover:shadow-md transition-all ${
                    previewTheme === themeOption.name ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className={`h-24 ${themeOption.preview} border-b relative`}>
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: themeOption.primary }} />
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: themeOption.secondary }} />
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: themeOption.accent }} />
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-medium">{themeOption.name}</span>
                    <Button 
                      size="sm" 
                      variant={previewTheme === themeOption.name ? "default" : "outline"}
                      onClick={() => applyPredefinedTheme(themeOption)}
                    >
                      {previewTheme === themeOption.name ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Eye className="h-4 w-4 mr-1" />
                      )}
                      {previewTheme === themeOption.name ? 'Applied' : 'Apply'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeManager;
