
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Palette, Brush, Check, RefreshCw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Predefined color themes
const predefinedThemes = [
  {
    name: 'Default Light',
    primary: '#0f172a',
    secondary: '#e5e7eb',
    accent: '#3b82f6',
    background: '#ffffff',
  },
  {
    name: 'Default Dark',
    primary: '#f8fafc',
    secondary: '#334155',
    accent: '#60a5fa',
    background: '#0f172a',
  },
  {
    name: 'Coffee Shop',
    primary: '#4b3621',
    secondary: '#d4c1a5',
    accent: '#8b5a2b',
    background: '#f5f5dc',
  },
  {
    name: 'Seafood',
    primary: '#05445E',
    secondary: '#D4F1F9',
    accent: '#189AB4',
    background: '#f8f9fa',
  },
  {
    name: 'Italian',
    primary: '#3c1518',
    secondary: '#f2e8c6',
    accent: '#69140e',
    background: '#fbfbf2',
  },
  {
    name: 'Vegetarian',
    primary: '#2d3e40',
    secondary: '#e9f5db',
    accent: '#76c893',
    background: '#f8f9fa',
  }
];

const ThemeManager: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [customTheme, setCustomTheme] = useState({
    primary: '',
    secondary: '',
    accent: '',
    background: '',
  });
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  // Get CSS variable representation
  const getCssVariableValue = (variableName: string) => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return computedStyle.getPropertyValue(variableName).trim();
  };
  
  // Effect to load current theme values when component mounts
  useEffect(() => {
    // We'll just initialize with empty values and let users pick from presets
    setCustomTheme({
      primary: '',
      secondary: '',
      accent: '',
      background: '',
    });
  }, []);
  
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
      title: 'Theme Preview',
      description: `Previewing ${theme.name} theme. Apply to save permanently.`,
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

  const applyCustomTheme = () => {
    if (!customTheme.primary || !customTheme.secondary) {
      toast({
        title: 'Missing Values',
        description: 'Please provide at least primary and secondary colors',
        variant: 'destructive',
      });
      return;
    }

    // Apply custom theme
    document.documentElement.style.setProperty('--primary', customTheme.primary);
    document.documentElement.style.setProperty('--secondary', customTheme.secondary);
    
    if (customTheme.accent) {
      document.documentElement.style.setProperty('--accent', customTheme.accent);
    }
    
    if (customTheme.background) {
      document.documentElement.style.setProperty('--background', customTheme.background);
    }
    
    setPreviewTheme('Custom');
    
    toast({
      title: 'Custom Theme Applied',
      description: 'Your custom theme has been applied',
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
          <div className="flex flex-wrap gap-3">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('light')}
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('dark')}
            >
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('system')}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brush className="h-5 w-5" /> Color Themes
          </CardTitle>
          <CardDescription>
            Choose from predefined color themes or create your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {previewTheme && (
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                <div className="text-sm font-medium">
                  Previewing: {previewTheme}
                </div>
                <Button size="sm" variant="outline" onClick={resetPreview}>
                  <RefreshCw className="h-4 w-4 mr-1" /> Reset Preview
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {predefinedThemes.map((themeOption) => (
                <Button
                  key={themeOption.name}
                  variant="outline"
                  className="h-auto flex flex-col items-start p-4 gap-2 justify-start text-left"
                  onClick={() => applyPredefinedTheme(themeOption)}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{themeOption.name}</span>
                    {previewTheme === themeOption.name && <Check className="h-4 w-4" />}
                  </div>
                  <div className="flex gap-2 w-full">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: themeOption.primary }} />
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: themeOption.secondary }} />
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: themeOption.accent }} />
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-3">Custom Theme</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <div 
                      className="w-10 h-10 border rounded" 
                      style={{ backgroundColor: customTheme.primary || '#000000' }}
                    />
                    <Input
                      id="primaryColor"
                      type="text"
                      placeholder="#000000"
                      value={customTheme.primary}
                      onChange={(e) => setCustomTheme({...customTheme, primary: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <div 
                      className="w-10 h-10 border rounded" 
                      style={{ backgroundColor: customTheme.secondary || '#e5e7eb' }}
                    />
                    <Input
                      id="secondaryColor"
                      type="text"
                      placeholder="#e5e7eb"
                      value={customTheme.secondary}
                      onChange={(e) => setCustomTheme({...customTheme, secondary: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <div 
                      className="w-10 h-10 border rounded" 
                      style={{ backgroundColor: customTheme.accent || '#3b82f6' }}
                    />
                    <Input
                      id="accentColor"
                      type="text"
                      placeholder="#3b82f6"
                      value={customTheme.accent}
                      onChange={(e) => setCustomTheme({...customTheme, accent: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <div 
                      className="w-10 h-10 border rounded" 
                      style={{ backgroundColor: customTheme.background || '#ffffff' }}
                    />
                    <Input
                      id="backgroundColor"
                      type="text"
                      placeholder="#ffffff"
                      value={customTheme.background}
                      onChange={(e) => setCustomTheme({...customTheme, background: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <Button className="mt-4" onClick={applyCustomTheme}>Apply Custom Theme</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeManager;
