
import { useState, useEffect } from 'react';
import { Category, MenuItem } from '../types';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        // Fetch categories from Supabase
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('position', { ascending: true });

        if (categoriesError) {
          throw categoriesError;
        }

        // Fetch menu items from Supabase
        const { data: menuItemsData, error: menuItemsError } = await supabase
          .from('menu_items')
          .select('*')
          .order('position', { ascending: true });

        if (menuItemsError) {
          throw menuItemsError;
        }

        // Transform the data to match our types
        const transformedCategories = categoriesData.map((category: any) => ({
          id: category.id,
          restaurantId: category.restaurant_id,
          name: category.name,
          position: category.position
        }));

        const transformedMenuItems = menuItemsData.map((item: any) => ({
          id: item.id,
          restaurantId: item.restaurant_id,
          categoryId: item.category_id,
          name: item.name,
          description: item.description || '',
          ingredients: item.ingredients || [],
          price: item.price,
          type: item.type as 'veg' | 'non-veg',
          tags: item.tags || [],
          imageUrl: item.image_url || '',
          available: item.available,
          position: item.position
        }));

        setCategories(transformedCategories);
        setMenuItems(transformedMenuItems);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching menu data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch menu'));
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const addCategory = async (category: Category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          restaurant_id: category.restaurantId,
          name: category.name,
          position: category.position
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newCategory: Category = {
        id: data.id,
        restaurantId: data.restaurant_id,
        name: data.name,
        position: data.position
      };

      setCategories(prev => [...prev, newCategory]);
      
      toast({
        title: "Category Added",
        description: `Category "${newCategory.name}" has been added successfully`
      });
      
      return newCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      
      toast({
        title: "Failed to Add Category",
        description: "There was an error creating the category",
        variant: "destructive"
      });
      
      setError(err instanceof Error ? err : new Error('Failed to add category'));
      throw err;
    }
  };

  const updateCategory = async (updatedCategory: Category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          restaurant_id: updatedCategory.restaurantId,
          name: updatedCategory.name,
          position: updatedCategory.position,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedCategory.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const transformedCategory: Category = {
        id: data.id,
        restaurantId: data.restaurant_id,
        name: data.name,
        position: data.position
      };

      setCategories(prev => 
        prev.map(cat => cat.id === updatedCategory.id ? transformedCategory : cat)
      );
      
      toast({
        title: "Category Updated",
        description: `Category "${transformedCategory.name}" has been updated`
      });
      
      return transformedCategory;
    } catch (err) {
      console.error('Error updating category:', err);
      
      toast({
        title: "Failed to Update Category",
        description: "There was an error updating the category",
        variant: "destructive"
      });
      
      setError(err instanceof Error ? err : new Error('Failed to update category'));
      throw err;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      // This will cascade delete all menu items in this category due to our foreign key constraint
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) {
        throw error;
      }

      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setMenuItems(prev => prev.filter(item => item.categoryId !== categoryId));
      
      toast({
        title: "Category Deleted",
        description: "Category and its menu items have been deleted"
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      
      toast({
        title: "Failed to Delete Category",
        description: "There was an error deleting the category",
        variant: "destructive"
      });
      
      setError(err instanceof Error ? err : new Error('Failed to delete category'));
      throw err;
    }
  };

  const addMenuItem = async (menuItem: MenuItem) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          restaurant_id: menuItem.restaurantId,
          category_id: menuItem.categoryId,
          name: menuItem.name,
          description: menuItem.description,
          ingredients: menuItem.ingredients || [],
          price: menuItem.price,
          type: menuItem.type,
          tags: menuItem.tags || [],
          image_url: menuItem.imageUrl || '',
          available: menuItem.available,
          position: menuItem.position
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newMenuItem: MenuItem = {
        id: data.id,
        restaurantId: data.restaurant_id,
        categoryId: data.category_id,
        name: data.name,
        description: data.description || '',
        ingredients: data.ingredients || [],
        price: data.price,
        type: data.type as 'veg' | 'non-veg',
        tags: data.tags || [],
        imageUrl: data.image_url || '',
        available: data.available,
        position: data.position
      };

      setMenuItems(prev => [...prev, newMenuItem]);
      
      toast({
        title: "Menu Item Added",
        description: `"${newMenuItem.name}" has been added to the menu`
      });
      
      return newMenuItem;
    } catch (err) {
      console.error('Error adding menu item:', err);
      
      toast({
        title: "Failed to Add Menu Item",
        description: "There was an error creating the menu item",
        variant: "destructive"
      });
      
      setError(err instanceof Error ? err : new Error('Failed to add menu item'));
      throw err;
    }
  };

  const updateMenuItem = async (updatedMenuItem: MenuItem) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          restaurant_id: updatedMenuItem.restaurantId,
          category_id: updatedMenuItem.categoryId,
          name: updatedMenuItem.name,
          description: updatedMenuItem.description,
          ingredients: updatedMenuItem.ingredients || [],
          price: updatedMenuItem.price,
          type: updatedMenuItem.type,
          tags: updatedMenuItem.tags || [],
          image_url: updatedMenuItem.imageUrl || '',
          available: updatedMenuItem.available,
          position: updatedMenuItem.position,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedMenuItem.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const transformedMenuItem: MenuItem = {
        id: data.id,
        restaurantId: data.restaurant_id,
        categoryId: data.category_id,
        name: data.name,
        description: data.description || '',
        ingredients: data.ingredients || [],
        price: data.price,
        type: data.type as 'veg' | 'non-veg',
        tags: data.tags || [],
        imageUrl: data.image_url || '',
        available: data.available,
        position: data.position
      };

      setMenuItems(prev => 
        prev.map(item => item.id === updatedMenuItem.id ? transformedMenuItem : item)
      );
      
      toast({
        title: "Menu Item Updated",
        description: `"${transformedMenuItem.name}" has been updated`
      });
      
      return transformedMenuItem;
    } catch (err) {
      console.error('Error updating menu item:', err);
      
      toast({
        title: "Failed to Update Menu Item",
        description: "There was an error updating the menu item",
        variant: "destructive"
      });
      
      setError(err instanceof Error ? err : new Error('Failed to update menu item'));
      throw err;
    }
  };

  const deleteMenuItem = async (menuItemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', menuItemId);

      if (error) {
        throw error;
      }

      setMenuItems(prev => prev.filter(item => item.id !== menuItemId));
      
      toast({
        title: "Menu Item Deleted",
        description: "Menu item has been removed successfully"
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting menu item:', err);
      
      toast({
        title: "Failed to Delete Menu Item",
        description: "There was an error removing the menu item",
        variant: "destructive"
      });
      
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
