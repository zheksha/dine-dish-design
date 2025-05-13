
import React, { useState } from 'react';
import { useRestaurant } from '../../hooks/useRestaurant';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const RestaurantPage: React.FC = () => {
  const { restaurant, updateRestaurant, isLoading } = useRestaurant();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    address: restaurant?.address || '',
    contactEmail: restaurant?.contactEmail || '',
    contactPhone: restaurant?.contactPhone || '',
    logoUrl: restaurant?.logoUrl || ''
  });
  
  const [formLoading, setFormLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.contactEmail) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setFormLoading(true);
      await updateRestaurant({
        id: restaurant?.id,
        ...formData
      });
      toast({
        title: "Restaurant Updated",
        description: "Your restaurant details have been updated successfully",
      });
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update restaurant details",
        variant: "destructive"
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <p>Loading restaurant details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Restaurant Configuration</h1>
          <p className="text-muted-foreground">
            Manage your restaurant details, contact information, and branding.
          </p>
        </div>
        
        <div className="grid gap-8 grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                General information about your restaurant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter restaurant name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea 
                    id="address" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter restaurant address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input 
                    id="contactEmail" 
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input 
                    id="contactPhone" 
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input 
                    id="logoUrl" 
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                  {formData.logoUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Logo Preview</p>
                      <img 
                        src={formData.logoUrl} 
                        alt="Restaurant Logo" 
                        className="h-16 w-16 object-contain border rounded" 
                      />
                    </div>
                  )}
                </div>
                
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RestaurantPage;
