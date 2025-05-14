import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { useDeals } from '../hooks/useDeals';
import CustomerLayout from '../layouts/CustomerLayout';
import MenuItemCard from '../components/MenuItemCard';
import DealBanner from '../components/DealBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const MenuPage: React.FC = () => {
  const { categories, menuItems, isLoading } = useMenu();
  const { getActiveDeals } = useDeals();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [compactView, setCompactView] = useState(false);
  
  const activeDeals = getActiveDeals();

  // Extract all unique tags from menu items
  const allTags = Array.from(
    new Set(menuItems.flatMap(item => item.tags))
  ).filter(Boolean);

  // Filter menu items based on search and tags
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.description.toLowerCase().includes(searchQuery.toLowerCase());
                       
    const matchesTags = selectedTags.length === 0 || 
                      selectedTags.some(tag => item.tags.includes(tag));
                      
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="layout-container py-16">
          <div className="text-center">
            <p>Loading menu...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="layout-container py-8">
        {/* Banner - can be conditionally rendered or customized */}
        <div className="mb-8 rounded-lg overflow-hidden bg-gradient-to-r from-primary/30 to-accent/30 p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Our Menu</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Discover our delicious selection of dishes, prepared with the finest ingredients
          </p>
        </div>
        
        {/* Active Deals */}
        {activeDeals.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Special Deals</h2>
            <div className="space-y-4">
              {activeDeals.map(deal => (
                <DealBanner 
                  key={deal.id} 
                  deal={deal} 
                  onClick={() => navigate(`/deals/${deal.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search the menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-grow overflow-x-auto pb-2 pr-4">
              <ScrollArea className="whitespace-nowrap">
                <div className="flex gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`food-tag cursor-pointer ${tag} ${
                        selectedTags.includes(tag) ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <LayoutGrid className={`h-4 w-4 ${!compactView ? 'text-primary' : 'text-muted-foreground'}`} />
                <Switch 
                  checked={compactView}
                  onCheckedChange={setCompactView}
                  id="compact-view"
                />
                <List className={`h-4 w-4 ${compactView ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <Label htmlFor="compact-view" className="text-sm">Compact</Label>
            </div>
          </div>
        </div>

        {/* Categories Tabs */}
        <Tabs defaultValue={categories[0]?.id} className="mb-8">
          <TabsList className="mb-6">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id || ''}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id || ''}>
              <div className={`grid gap-6 ${
                compactView 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {filteredMenuItems
                  .filter(item => item.categoryId === category.id)
                  .map(menuItem => (
                    <MenuItemCard 
                      key={menuItem.id} 
                      menuItem={menuItem}
                      onClick={() => navigate(`/menu/${menuItem.id}`)}
                      compact={compactView}
                    />
                  ))}
                
                {filteredMenuItems.filter(item => item.categoryId === category.id).length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">
                      No menu items match your search in this category.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </CustomerLayout>
  );
};

export default MenuPage;
