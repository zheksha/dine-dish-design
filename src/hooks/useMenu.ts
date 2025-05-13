
import { useState, useEffect } from 'react';
import { Category, MenuItem } from '../types';
import { mockCategories, mockMenuItems } from '../data/mockData';

export const useMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // In a real app, this would be API calls to Supabase
        // For now, we'll use mock data
        setCategories(mockCategories);
        setMenuItems(mockMenuItems);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch menu'));
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const addCategory = async (category: Category) => {
    try {
      // In a real app, this would be an API call to Supabase
      const newCategory = { ...category, id: String(Date.now()) };
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add category'));
      throw err;
    }
  };

  const updateCategory = async (updatedCategory: Category) => {
    try {
      // In a real app, this would be an API call to Supabase
      setCategories(prev => 
        prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
      );
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update category'));
      throw err;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      // In a real app, this would be an API call to Supabase
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      // Also delete all menu items in this category
      setMenuItems(prev => prev.filter(item => item.categoryId !== categoryId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete category'));
      throw err;
    }
  };

  const addMenuItem = async (menuItem: MenuItem) => {
    try {
      // In a real app, this would be an API call to Supabase
      const newMenuItem = { ...menuItem, id: String(Date.now()) };
      setMenuItems(prev => [...prev, newMenuItem]);
      return newMenuItem;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add menu item'));
      throw err;
    }
  };

  const updateMenuItem = async (updatedMenuItem: MenuItem) => {
    try {
      // In a real app, this would be an API call to Supabase
      setMenuItems(prev => 
        prev.map(item => item.id === updatedMenuItem.id ? updatedMenuItem : item)
      );
      return updatedMenuItem;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update menu item'));
      throw err;
    }
  };

  const deleteMenuItem = async (menuItemId: string) => {
    try {
      // In a real app, this would be an API call to Supabase
      setMenuItems(prev => prev.filter(item => item.id !== menuItemId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete menu item'));
      throw err;
    }
  };

  const getMenuItemsByCategory = (categoryId: string) => {
    return menuItems.filter(item => item.categoryId === categoryId);
  };

  return {
    categories,
    menuItems,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItemsByCategory
  };
};
