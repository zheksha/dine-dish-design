
import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../hooks/useRestaurant';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';

const RestaurantPage: React.FC = () => {
  const { restaurant, updateRestaurant, isLoading } = useRestaurant();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    logoUrl: ''
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Update form data when restaurant data loads
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setUploadingImage(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `restaurant-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({
        ...prev,
        logoUrl: data.publicUrl
      }));
      
      toast({
        title: "Image Uploaded",
        description: "Restaurant logo has been uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload restaurant logo",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
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
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading restaurant details...</span>
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
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                General information about your restaurant
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
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
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Saving...
                    </> : 
                    "Save Changes"
                  }
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Logo</CardTitle>
              <CardDescription>
                Upload your restaurant logo for branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                {formData.logoUrl ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto">
                      <img 
                        src={formData.logoUrl} 
                        alt="Restaurant Logo" 
                        className="h-40 w-auto object-contain rounded-md border p-2" 
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setFormData(prev => ({...prev, logoUrl: ''}))}
                      className="w-full"
                    >
                      Remove Logo
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-4">
                    <div className="mx-auto bg-muted rounded-full h-20 w-20 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        No logo uploaded. Upload one now.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUpload">Upload Logo</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    disabled={uploadingImage}
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="w-full"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> 
                        Upload Image
                      </>
                    )}
                  </Button>
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, at least 200x200px in PNG or JPG format.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Or enter logo URL</Label>
                <Input 
                  id="logoUrl" 
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="button" 
                onClick={handleSubmit} 
                disabled={formLoading}
                className="w-full"
              >
                {formLoading ? 
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Saving...
                  </> : 
                  "Update Branding"
                }
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Preview</CardTitle>
            <CardDescription>
              See how your restaurant appears to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-6 bg-card shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                {formData.logoUrl && (
                  <img 
                    src={formData.logoUrl} 
                    alt="Restaurant Logo" 
                    className="h-16 w-16 object-contain rounded-md" 
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{formData.name || 'Restaurant Name'}</h2>
                  <p className="text-sm text-muted-foreground">{formData.address || 'Restaurant Address'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Email: </span>
                  {formData.contactEmail || 'contact@example.com'}
                </div>
                <div>
                  <span className="font-medium">Phone: </span>
                  {formData.contactPhone || '(555) 123-4567'}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                View Customer Menu
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RestaurantPage;
