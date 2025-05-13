
import React, { useState } from 'react';
import { useDeals } from '../../hooks/useDeals';
import { useMenu } from '../../hooks/useMenu';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Deal, MenuItem } from '../../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';

const DealsPage: React.FC = () => {
  const { deals, isLoading: dealsLoading, addDeal, updateDeal, deleteDeal } = useDeals();
  const { menuItems, isLoading: menuLoading } = useMenu();
  const { toast } = useToast();
  
  // Form state
  const initialDealState = {
    name: '',
    description: '',
    validFrom: new Date(),
    validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: 0,
    items: [] as MenuItem[]
  };
  
  const [newDeal, setNewDeal] = useState<Deal>(initialDealState);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  
  // UI state
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [isEditingDeal, setIsEditingDeal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Deal Form Handlers
  const handleDealChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const formDeal = editingDeal || newDeal;
    let updatedValue: any = value;
    
    if (type === 'number') {
      updatedValue = parseFloat(value);
    }
    
    const updatedDeal = { 
      ...formDeal,
      [name]: updatedValue
    };
    
    if (editingDeal) {
      setEditingDeal(updatedDeal as Deal);
    } else {
      setNewDeal(updatedDeal as Deal);
    }
  };
  
  const handleDateChange = (date: Date | undefined, field: 'validFrom' | 'validTo') => {
    if (!date) return;
    
    const formDeal = editingDeal || newDeal;
    
    const updatedDeal = { 
      ...formDeal,
      [field]: date
    };
    
    if (editingDeal) {
      setEditingDeal(updatedDeal);
    } else {
      setNewDeal(updatedDeal);
    }
  };
  
  const toggleMenuItemSelection = (item: MenuItem) => {
    const newSelectedItems = new Set(selectedItems);
    
    if (newSelectedItems.has(item.id!)) {
      newSelectedItems.delete(item.id!);
    } else {
      newSelectedItems.add(item.id!);
    }
    
    setSelectedItems(newSelectedItems);
    
    const formDeal = editingDeal || newDeal;
    const currentItems = formDeal.items || [];
    
    let updatedItems: MenuItem[];
    
    if (newSelectedItems.has(item.id!)) {
      updatedItems = [...currentItems, item];
    } else {
      updatedItems = currentItems.filter(i => i.id !== item.id);
    }
    
    const updatedDeal = { 
      ...formDeal,
      items: updatedItems
    };
    
    if (editingDeal) {
      setEditingDeal(updatedDeal);
    } else {
      setNewDeal(updatedDeal);
    }
  };
  
  const handleDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDeal) {
        await updateDeal(editingDeal);
        toast({ title: "Deal updated successfully" });
        setIsEditingDeal(false);
        setEditingDeal(null);
      } else {
        await addDeal(newDeal);
        toast({ title: "Deal added successfully" });
        setIsAddingDeal(false);
        setNewDeal(initialDealState);
      }
      
      // Reset selected items
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Error saving deal:", error);
      toast({ 
        title: "Error", 
        description: "Failed to save deal", 
        variant: "destructive" 
      });
    }
  };
  
  const handleEditDeal = (deal: Deal) => {
    // Initialize selected items
    const itemIds = deal.items?.map(item => item.id!) || [];
    setSelectedItems(new Set(itemIds));
    
    setEditingDeal(deal);
    setIsEditingDeal(true);
  };
  
  const handleDeleteDeal = async (dealId: string) => {
    try {
      await deleteDeal(dealId);
      toast({ title: "Deal deleted successfully" });
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast({ 
        title: "Error", 
        description: "Failed to delete deal", 
        variant: "destructive" 
      });
    }
  };
  
  // Filter menu items by search query
  const filteredMenuItems = menuItems.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.description.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Separate active and expired deals
  const now = new Date();
  const activeDeals = deals.filter(
    deal => new Date(deal.validFrom) <= now && new Date(deal.validTo) >= now
  );
  
  const expiredDeals = deals.filter(
    deal => new Date(deal.validTo) < now
  );
  
  const upcomingDeals = deals.filter(
    deal => new Date(deal.validFrom) > now
  );
  
  const isLoading = dealsLoading || menuLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <p>Loading deals data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Deals Management</h1>
          <p className="text-muted-foreground">
            Create and manage special deals and promotions
          </p>
        </div>
        
        {/* Deals List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-center">
              <span>Deals & Promotions</span>
              <Button 
                onClick={() => {
                  setNewDeal(initialDealState);
                  setSelectedItems(new Set());
                  setIsAddingDeal(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> New Deal
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active Deals</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
                <TabsTrigger value="all">All Deals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="pt-4">
                {renderDealsList(activeDeals, 'active')}
              </TabsContent>
              
              <TabsContent value="upcoming" className="pt-4">
                {renderDealsList(upcomingDeals, 'upcoming')}
              </TabsContent>
              
              <TabsContent value="expired" className="pt-4">
                {renderDealsList(expiredDeals, 'expired')}
              </TabsContent>
              
              <TabsContent value="all" className="pt-4">
                {renderDealsList(deals, 'all')}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Deal Dialog */}
      <Dialog 
        open={isAddingDeal}
        onOpenChange={setIsAddingDeal}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Deal</DialogTitle>
            <DialogDescription>
              Add a new special deal or promotion
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleDealSubmit} className="space-y-4 pt-2">
            {renderDealForm()}
            
            <DialogFooter className="pt-2">
              <Button type="submit">Create Deal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Deal Dialog */}
      <Dialog 
        open={isEditingDeal}
        onOpenChange={(open) => {
          setIsEditingDeal(open);
          if (!open) setEditingDeal(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
            <DialogDescription>
              Update the details of your deal
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleDealSubmit} className="space-y-4 pt-2">
            {renderDealForm()}
            
            <DialogFooter className="pt-2">
              <Button type="submit">Update Deal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
  
  function renderDealsList(dealsList: Deal[], type: 'active' | 'upcoming' | 'expired' | 'all') {
    if (dealsList.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {type === 'active' && 'No active deals'}
            {type === 'upcoming' && 'No upcoming deals'}
            {type === 'expired' && 'No expired deals'}
            {type === 'all' && 'No deals created yet'}
          </p>
          <Button 
            variant="link" 
            onClick={() => {
              setNewDeal(initialDealState);
              setIsAddingDeal(true);
            }}
          >
            Create your first deal
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {dealsList.map((deal) => {
          const isActive = new Date(deal.validFrom) <= new Date() && 
                           new Date(deal.validTo) >= new Date();
          const isUpcoming = new Date(deal.validFrom) > new Date();
          const isExpired = new Date(deal.validTo) < new Date();
          
          return (
            <div
              key={deal.id}
              className={`border rounded-md overflow-hidden p-4 ${
                isActive ? 'border-accent' : isExpired ? 'border-gray-200' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{deal.name}</h3>
                    {isActive && (
                      <Badge variant="outline" className="bg-accent/20">Active</Badge>
                    )}
                    {isUpcoming && (
                      <Badge variant="outline" className="bg-primary/10">Upcoming</Badge>
                    )}
                    {isExpired && (
                      <Badge variant="outline" className="bg-muted">Expired</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {deal.description}
                  </p>
                  
                  <div className="flex flex-wrap text-xs text-muted-foreground mb-3 gap-x-4">
                    <span>
                      <strong>Discount:</strong> {deal.discountType === 'percentage' 
                        ? `${deal.discountValue}% off`
                        : `$${deal.discountValue.toFixed(2)} off`}
                    </span>
                    <span>
                      <strong>Valid:</strong> {format(new Date(deal.validFrom), 'MMM d, yyyy')} - {format(new Date(deal.validTo), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  {deal.items && deal.items.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {deal.items.map((item) => (
                        <Badge key={item.id} variant="secondary" className="text-xs">
                          {item.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8"
                    onClick={() => handleEditDeal(deal)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Deal</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{deal.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteDeal(deal.id || '')}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  
  function renderDealForm() {
    const formDeal = editingDeal || newDeal;
    
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="name">Deal Name</Label>
          <Input
            id="name"
            name="name"
            value={formDeal.name}
            onChange={handleDealChange}
            placeholder="e.g., Family Feast"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formDeal.description}
            onChange={handleDealChange}
            placeholder="Describe your deal"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <div className="space-y-2">
            <Label>Valid From</Label>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formDeal.validFrom ? (
                      format(formDeal.validFrom, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formDeal.validFrom}
                    onSelect={(date) => handleDateChange(date, 'validFrom')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Valid To</Label>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formDeal.validTo ? (
                      format(formDeal.validTo, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formDeal.validTo}
                    onSelect={(date) => handleDateChange(date, 'validTo')}
                    initialFocus
                    disabled={(date) => date < formDeal.validFrom}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="discountType">Discount Type</Label>
            <select
              id="discountType"
              name="discountType"
              value={formDeal.discountType}
              onChange={handleDealChange}
              className="w-full p-2 rounded-md border border-input bg-background"
              required
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat Amount</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discountValue">
              {formDeal.discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
            </Label>
            <Input
              id="discountValue"
              name="discountValue"
              type="number"
              step={formDeal.discountType === 'percentage' ? "1" : "0.01"}
              min="0"
              max={formDeal.discountType === 'percentage' ? "100" : undefined}
              value={formDeal.discountValue}
              onChange={handleDealChange}
              placeholder="0.00"
              required
            />
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Select Menu Items</h3>
            <p className="text-sm text-muted-foreground">
              Choose which menu items this deal applies to
            </p>
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            
            <div className="border rounded-md h-60 overflow-y-auto">
              {filteredMenuItems.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No menu items found
                </div>
              ) : (
                <ul className="divide-y">
                  {filteredMenuItems.map(item => {
                    const isSelected = selectedItems.has(item.id || '');
                    
                    return (
                      <li
                        key={item.id}
                        className={`flex items-center p-3 hover:bg-muted/50 cursor-pointer ${
                          isSelected ? 'bg-muted' : ''
                        }`}
                        onClick={() => toggleMenuItemSelection(item)}
                      >
                        <div className="flex-grow">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} • {item.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                          </div>
                        </div>
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full border border-input ${
                          isSelected ? 'bg-primary text-primary-foreground' : ''
                        }`}>
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          
          <div>
            <Label>Selected Items ({(formDeal.items || []).length})</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formDeal.items || []).length === 0 ? (
                <span className="text-sm text-muted-foreground">No items selected</span>
              ) : (
                formDeal.items!.map(item => (
                  <Badge key={item.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center">
                    {item.name}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenuItemSelection(item);
                      }}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default DealsPage;
