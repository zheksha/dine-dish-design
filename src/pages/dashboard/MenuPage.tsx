
import React, { useState } from 'react';
import { useMenu } from '../../hooks/useMenu';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Edit, Trash2, Check } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Category, MenuItem } from '../../types';

const MenuPage: React.FC = () => {
  const { categories, menuItems, isLoading, addCategory, updateCategory, deleteCategory, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const { toast } = useToast();
  
  // Category form state
  const [newCategory, setNewCategory] = useState<Category>({
    name: '',
    position: 0
  });
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Menu Item form state
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    categoryId: '',
    name: '',
    description: '',
    price: 0,
    type: 'veg',
    tags: [],
    available: true,
    position: 0
  });
  
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [isEditingMenuItem, setIsEditingMenuItem] = useState(false);
  
  // Category Form Handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory);
        toast({ title: "Category updated successfully" });
        setEditingCategory(null);
      } else {
        const position = categories.length;
        await addCategory({ ...newCategory, position });
        toast({ title: "Category added successfully" });
        setNewCategory({ name: '', position: 0 });
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast({ 
        title: "Error", 
        description: "Failed to save category", 
        variant: "destructive" 
      });
    }
  };
  
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      toast({ title: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({ 
        title: "Error", 
        description: "Failed to delete category", 
        variant: "destructive" 
      });
    }
  };
  
  // Menu Item Form Handlers
  const handleMenuItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const formItem = editingMenuItem || newMenuItem;
    let updatedValue = value;
    
    if (type === 'number') {
      updatedValue = parseFloat(value);
    }
    
    const updatedItem = { 
      ...formItem,
      [name]: updatedValue
    };
    
    if (editingMenuItem) {
      setEditingMenuItem(updatedItem as MenuItem);
    } else {
      setNewMenuItem(updatedItem as MenuItem);
    }
  };
  
  const handleMenuItemAvailabilityChange = (available: boolean) => {
    const formItem = editingMenuItem || newMenuItem;
    
    const updatedItem = { 
      ...formItem,
      available
    };
    
    if (editingMenuItem) {
      setEditingMenuItem(updatedItem);
    } else {
      setNewMenuItem(updatedItem);
    }
  };
  
  const handleMenuItemTypeChange = (type: 'veg' | 'non-veg') => {
    const formItem = editingMenuItem || newMenuItem;
    
    const updatedItem = { 
      ...formItem,
      type
    };
    
    if (editingMenuItem) {
      setEditingMenuItem(updatedItem);
    } else {
      setNewMenuItem(updatedItem);
    }
  };
  
  const handleAddTag = () => {
    if (!currentTag.trim()) return;
    
    const formItem = editingMenuItem || newMenuItem;
    const tags = formItem.tags || [];
    
    if (!tags.includes(currentTag)) {
      const updatedItem = { 
        ...formItem,
        tags: [...tags, currentTag]
      };
      
      if (editingMenuItem) {
        setEditingMenuItem(updatedItem);
      } else {
        setNewMenuItem(updatedItem);
      }
    }
    
    setCurrentTag('');
  };
  
  const handleRemoveTag = (tag: string) => {
    const formItem = editingMenuItem || newMenuItem;
    const tags = formItem.tags || [];
    
    const updatedItem = { 
      ...formItem,
      tags: tags.filter(t => t !== tag)
    };
    
    if (editingMenuItem) {
      setEditingMenuItem(updatedItem);
    } else {
      setNewMenuItem(updatedItem);
    }
  };
  
  const handleMenuItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMenuItem) {
        await updateMenuItem(editingMenuItem);
        toast({ title: "Menu item updated successfully" });
        setIsEditingMenuItem(false);
        setEditingMenuItem(null);
      } else {
        const categoryItems = menuItems.filter(
          item => item.categoryId === newMenuItem.categoryId
        );
        
        const position = categoryItems.length;
        await addMenuItem({ ...newMenuItem, position });
        toast({ title: "Menu item added successfully" });
        setIsAddingMenuItem(false);
        setNewMenuItem({
          categoryId: selectedCategory || '',
          name: '',
          description: '',
          price: 0,
          type: 'veg',
          tags: [],
          available: true,
          position: 0
        });
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast({ 
        title: "Error", 
        description: "Failed to save menu item", 
        variant: "destructive" 
      });
    }
  };
  
  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setIsEditingMenuItem(true);
  };
  
  const handleDeleteMenuItem = async (menuItemId: string) => {
    try {
      await deleteMenuItem(menuItemId);
      toast({ title: "Menu item deleted successfully" });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({ 
        title: "Error", 
        description: "Failed to delete menu item", 
        variant: "destructive" 
      });
    }
  };
  
  // Initialize selected category when categories load
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id || '');
      
      // Update new menu item with default category
      setNewMenuItem(prev => ({
        ...prev,
        categoryId: categories[0].id || ''
      }));
    }
  }, [categories, selectedCategory]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <p>Loading menu data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage your menu categories and food items.
          </p>
        </div>
        
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Categories Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <span>Categories</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription>
                        Create a new category for your menu items
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleCategorySubmit} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input
                          id="categoryName"
                          value={newCategory.name}
                          onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                          placeholder="e.g., Appetizers"
                          required
                        />
                      </div>
                      
                      <DialogFooter className="pt-2">
                        <Button type="submit">Save Category</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.length === 0 ? (
                  <p className="text-center py-8 text-sm text-muted-foreground">
                    No categories yet. Add your first category to get started.
                  </p>
                ) : (
                  <ul>
                    {categories.map(category => (
                      <li 
                        key={category.id} 
                        className={`flex items-center justify-between p-2 rounded-md ${
                          selectedCategory === category.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                        }`}
                      >
                        <div 
                          className="flex-grow cursor-pointer"
                          onClick={() => setSelectedCategory(category.id || '')}
                        >
                          <span>{category.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{category.name}"? This will also delete all menu items in this category.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteCategory(category.id || '')}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Edit Category Dialog */}
          <Dialog 
            open={editingCategory !== null}
            onOpenChange={(open) => !open && setEditingCategory(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update your category details
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCategorySubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="editCategoryName">Category Name</Label>
                  <Input
                    id="editCategoryName"
                    value={editingCategory?.name || ''}
                    onChange={e => editingCategory && setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder="e.g., Appetizers"
                    required
                  />
                </div>
                
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setEditingCategory(null)} className="mr-2">
                    Cancel
                  </Button>
                  <Button type="submit">Update Category</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center">
                  <span>Menu Items</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setNewMenuItem({
                        categoryId: selectedCategory || '',
                        name: '',
                        description: '',
                        price: 0,
                        type: 'veg',
                        tags: [],
                        available: true,
                        position: 0
                      });
                      setIsAddingMenuItem(true);
                    }}
                    disabled={!selectedCategory}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedCategory ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Select a category to view and manage its menu items</p>
                  </div>
                ) : (
                  <>
                    <Tabs defaultValue="all">
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="available">Available</TabsTrigger>
                        <TabsTrigger value="unavailable">Unavailable</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="pt-4">
                        {renderMenuItemsList(menuItems.filter(item => item.categoryId === selectedCategory))}
                      </TabsContent>
                      
                      <TabsContent value="available" className="pt-4">
                        {renderMenuItemsList(menuItems.filter(item => 
                          item.categoryId === selectedCategory && item.available
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="unavailable" className="pt-4">
                        {renderMenuItemsList(menuItems.filter(item => 
                          item.categoryId === selectedCategory && !item.available
                        ))}
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Add Menu Item Dialog */}
      <Dialog 
        open={isAddingMenuItem}
        onOpenChange={setIsAddingMenuItem}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
            <DialogDescription>
              Add a new menu item to your selected category
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleMenuItemSubmit} className="space-y-4 pt-2">
            {renderMenuItemForm()}
            
            <DialogFooter className="pt-2">
              <Button type="submit">Add Menu Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Menu Item Dialog */}
      <Dialog 
        open={isEditingMenuItem}
        onOpenChange={(open) => {
          setIsEditingMenuItem(open);
          if (!open) setEditingMenuItem(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details of your menu item
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleMenuItemSubmit} className="space-y-4 pt-2">
            {renderMenuItemForm()}
            
            <DialogFooter className="pt-2">
              <Button type="submit">Update Menu Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
  
  function renderMenuItemsList(items: MenuItem[]) {
    if (items.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No menu items in this category</p>
          {selectedCategory && (
            <Button 
              variant="link" 
              onClick={() => {
                setNewMenuItem({
                  categoryId: selectedCategory,
                  name: '',
                  description: '',
                  price: 0,
                  type: 'veg',
                  tags: [],
                  available: true,
                  position: 0
                });
                setIsAddingMenuItem(true);
              }}
            >
              Add your first menu item
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-md overflow-hidden flex flex-col md:flex-row"
          >
            {/* Image */}
            <div className="w-full md:w-32 h-28 bg-muted">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-grow p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-medium">{item.name}</h3>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-1">
                <Badge variant={item.type === 'veg' ? 'secondary' : 'outline'}>
                  {item.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                </Badge>
                
                {!item.available && (
                  <Badge variant="destructive">Unavailable</Badge>
                )}
                
                {item.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex md:flex-col justify-end p-4 border-t md:border-t-0 md:border-l">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEditMenuItem(item)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{item.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDeleteMenuItem(item.id || '')}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  function renderMenuItemForm() {
    const formItem = editingMenuItem || newMenuItem;
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              name="name"
              value={formItem.name}
              onChange={handleMenuItemChange}
              placeholder="e.g., Classic Burger"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formItem.price}
              onChange={handleMenuItemChange}
              placeholder="0.00"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formItem.description}
            onChange={handleMenuItemChange}
            placeholder="Describe your menu item"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={formItem.categoryId}
              onChange={handleMenuItemChange}
              className="w-full p-2 rounded-md border border-input bg-background"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Item Type</Label>
            <div className="flex gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="typeVeg"
                  checked={formItem.type === 'veg'} 
                  onChange={() => handleMenuItemTypeChange('veg')}
                  className="w-4 h-4"
                />
                <Label htmlFor="typeVeg" className="font-normal">Vegetarian</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="typeNonVeg"
                  checked={formItem.type === 'non-veg'} 
                  onChange={() => handleMenuItemTypeChange('non-veg')}
                  className="w-4 h-4"
                />
                <Label htmlFor="typeNonVeg" className="font-normal">Non-Vegetarian</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formItem.imageUrl || ''}
            onChange={handleMenuItemChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex items-center gap-2">
            <Input
              value={currentTag}
              onChange={e => setCurrentTag(e.target.value)}
              placeholder="e.g., spicy, gluten-free"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {formItem.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-secondary-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            
            {formItem.tags.length === 0 && (
              <span className="text-sm text-muted-foreground">No tags added</span>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="available">Availability</Label>
            <div className="text-sm text-muted-foreground">
              Is this item currently available on the menu?
            </div>
          </div>
          <Switch
            id="available"
            checked={formItem.available}
            onCheckedChange={handleMenuItemAvailabilityChange}
          />
        </div>
      </>
    );
  }
};

export default MenuPage;
