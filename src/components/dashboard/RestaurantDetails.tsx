
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRestaurant } from '../../hooks/useRestaurant';
import { Building, Mail, Phone, Save, Upload, Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from '../../integrations/supabase/client';

const RestaurantDetails: React.FC = () => {
  const { restaurant, updateRestaurant, isLoading } = useRestaurant();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    logoUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when restaurant data is loaded
  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        address: restaurant.address || '',
        contactEmail: restaurant.contactEmail || '',
        contactPhone: restaurant.contactPhone || '',
        logoUrl: restaurant.logoUrl || ''
      });
    }
  }, [restaurant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !restaurant) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload the file to supabase storage
      const fileName = `${restaurant.id}_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('restaurant_logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('restaurant_logos')
        .getPublicUrl(data.path);

      // Update logo URL in form data
      const logoUrl = publicUrlData.publicUrl;
      setFormData(prev => ({ ...prev, logoUrl }));

      toast({
        title: "Logo uploaded",
        description: "Your restaurant logo has been uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload logo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logoUrl: '' }));
    toast({
      title: "Logo removed",
      description: "Your restaurant logo has been removed"
    });
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload Section */}
            <div className="space-y-3">
              <Label className="flex items-center gap-1">
                <Image className="h-4 w-4" /> Restaurant Logo
              </Label>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {formData.logoUrl ? (
                  <div className="relative overflow-hidden border rounded-md w-32 h-32">
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
                    <Button 
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      type="button"
                      onClick={removeLogo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border border-dashed rounded-md w-32 h-32 bg-muted/30">
                    <Image className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
                
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    id="logo"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploading ? 'Uploading...' : 'Upload Logo'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image (1:1 ratio), max 2MB
                  </p>
                </div>
              </div>
            </div>
            
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
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantDetails;
