
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRestaurant } from '../../hooks/useRestaurant';
import { Building, Mail, Phone, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const RestaurantDetails: React.FC = () => {
  const { restaurant, updateRestaurant, isLoading } = useRestaurant();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    address: restaurant?.address || '',
    contactEmail: restaurant?.contactEmail || '',
    contactPhone: restaurant?.contactPhone || '',
    logoUrl: restaurant?.logoUrl || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    setIsSubmitting(true);
    try {
      await updateRestaurant({
        id: restaurant.id,
        ...formData
      });
      toast({
        title: "Success!",
        description: "Restaurant details have been updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update restaurant details",
        variant: "destructive"
      });
      console.error("Error updating restaurant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading restaurant details...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" /> Restaurant Information
          </CardTitle>
          <CardDescription>
            Update your restaurant's basic information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
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
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                name="address"
                value={formData.address} 
                onChange={handleInputChange}
                placeholder="Enter restaurant address"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Contact Email
                </Label>
                <Input 
                  id="contactEmail" 
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail} 
                  onChange={handleInputChange}
                  placeholder="contact@restaurant.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="flex items-center gap-1">
                  <Phone className="h-4 w-4" /> Contact Phone
                </Label>
                <Input 
                  id="contactPhone" 
                  name="contactPhone"
                  value={formData.contactPhone} 
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
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
                <div className="mt-2 border rounded-md overflow-hidden w-24 h-24">
                  <AspectRatio ratio={1 / 1}>
                    <img 
                      src={formData.logoUrl} 
                      alt="Restaurant Logo" 
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Logo';
                      }}
                    />
                  </AspectRatio>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantDetails;
