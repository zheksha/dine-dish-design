
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileImage, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Category, MenuItem } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MenuPrintProps {
  categories: Category[];
  menuItems: MenuItem[];
  restaurantName: string;
}

const MenuPrint: React.FC<MenuPrintProps> = ({ 
  categories, 
  menuItems, 
  restaurantName 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paperSize, setPaperSize] = useState('letter');
  const [showPrices, setShowPrices] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showVegLabels, setShowVegLabels] = useState(true);
  const [showImages, setShowImages] = useState(true);
  const [layout, setLayout] = useState('grid');
  const { toast } = useToast();
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your popup settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare CSS for the print layout
    let pageSize = "8.5in 11in"; // Letter size by default
    if (paperSize === 'a4') {
      pageSize = "210mm 297mm";
    } else if (paperSize === 'legal') {
      pageSize = "8.5in 14in";
    }
    
    // Generate the menu HTML with styling
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${restaurantName} - Menu</title>
        <style>
          @page {
            size: ${pageSize};
            margin: 0.5in;
          }
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 100%;
            margin: 0 auto;
          }
          header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
          }
          .restaurant-name {
            font-size: 32px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 1px;
          }
          .restaurant-tagline {
            font-size: 16px;
            font-style: italic;
            color: #555;
            margin: 5px 0 0;
          }
          h2 {
            font-size: 24px;
            margin: 30px 0 20px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .menu-items-container {
            display: ${layout === 'grid' ? 'grid' : 'block'};
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .menu-item {
            margin-bottom: 20px;
            page-break-inside: avoid;
            display: flex;
            flex-direction: ${layout === 'grid' ? 'column' : 'row'};
            border-bottom: ${layout === 'list' ? '1px solid #eee' : 'none'};
            padding-bottom: ${layout === 'list' ? '15px' : '0'};
          }
          .menu-item-image {
            width: ${layout === 'grid' ? '100%' : '80px'};
            height: ${layout === 'grid' ? '120px' : '80px'};
            object-fit: cover;
            border-radius: 4px;
            margin-${layout === 'grid' ? 'bottom' : 'right'}: 15px;
          }
          .menu-item-content {
            flex: 1;
          }
          .menu-item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
          }
          .menu-item-name {
            font-weight: bold;
            font-size: 16px;
            margin: 0;
          }
          .menu-item-price {
            font-weight: bold;
            white-space: nowrap;
          }
          .menu-item-description {
            margin: 5px 0;
            font-size: 14px;
            color: #555;
          }
          .menu-item-tags {
            font-size: 12px;
            color: #777;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
          }
          .tag {
            background-color: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
          }
          .type-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 6px;
          }
          .veg {
            background-color: #4CAF50;
          }
          .non-veg {
            background-color: #F44336;
          }
          .category-description {
            font-size: 14px;
            color: #555;
            margin-bottom: 15px;
            font-style: italic;
          }
          .page-break {
            page-break-before: always;
          }
          footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
          .no-image-placeholder {
            width: ${layout === 'grid' ? '100%' : '80px'};
            height: ${layout === 'grid' ? '120px' : '80px'};
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            color: #999;
            font-size: 12px;
            margin-${layout === 'grid' ? 'bottom' : 'right'}: 15px;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1 class="restaurant-name">${restaurantName}</h1>
            <p class="restaurant-tagline">Menu</p>
          </header>
          
          <div class="no-print" style="text-align: center; margin-bottom: 20px;">
            <p>Press Ctrl+P or Cmd+P to print this menu.</p>
          </div>
    `);
    
    // Generate menu content by category
    categories.forEach((category, i) => {
      // Add page break after every category (except the first)
      if (i > 0) {
        printWindow.document.write('<div class="page-break"></div>');
      }
      
      const categoryItems = menuItems.filter(
        item => item.categoryId === category.id && item.available
      );
      
      if (categoryItems.length > 0) {
        printWindow.document.write(`
          <section>
            <h2>${category.name}</h2>
            ${category.description ? `<p class="category-description">${category.description}</p>` : ''}
            <div class="menu-items-container">
        `);
        
        categoryItems.forEach(item => {
          printWindow.document.write(`
            <div class="menu-item">
              ${showImages ? item.imageUrl ? 
                `<img src="${item.imageUrl}" alt="${item.name}" class="menu-item-image" />` :
                `<div class="no-image-placeholder">No Image</div>`
              : ''}
              <div class="menu-item-content">
                <div class="menu-item-header">
                  <p class="menu-item-name">
                    ${showVegLabels ? 
                      `<span class="type-indicator ${item.type === 'veg' ? 'veg' : 'non-veg'}"></span>` 
                      : ''}
                    ${item.name}
                  </p>
                  ${showPrices ? 
                    `<span class="menu-item-price">$${item.price.toFixed(2)}</span>` 
                    : ''}
                </div>
                ${showDescription && item.description ? 
                  `<p class="menu-item-description">${item.description}</p>` 
                  : ''}
                ${item.tags && item.tags.length > 0 ? 
                  `<div class="menu-item-tags">${
                    item.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')
                  }</div>` 
                  : ''}
              </div>
            </div>
          `);
        });
        
        printWindow.document.write('</div></section>');
      }
    });
    
    // Footer
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    
    printWindow.document.write(`
          <footer>
            <p>${restaurantName} • Menu updated on ${formattedDate}</p>
            <p>Thank you for dining with us!</p>
          </footer>
        </div>
        <script>
          setTimeout(() => { window.print(); }, 1000);
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setIsDialogOpen(false);
    
    toast({
      title: "Print dialog opened",
      description: "Your menu is ready to print"
    });
  };
  
  const handlePreview = () => {
    // Preview basically does the same thing as print but doesn't call window.print()
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      toast({
        title: "Error",
        description: "Unable to open preview window. Please check your popup settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare CSS for the print layout
    let pageSize = "8.5in 11in"; // Letter size by default
    if (paperSize === 'a4') {
      pageSize = "210mm 297mm";
    } else if (paperSize === 'legal') {
      pageSize = "8.5in 14in";
    }
    
    // Generate the same menu HTML but without auto-print
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${restaurantName} - Menu Preview</title>
        <style>
          @page {
            size: ${pageSize};
            margin: 0.5in;
          }
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 100%;
            margin: 0 auto;
            padding: 20px;
          }
          header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
          }
          .restaurant-name {
            font-size: 32px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 1px;
          }
          .restaurant-tagline {
            font-size: 16px;
            font-style: italic;
            color: #555;
            margin: 5px 0 0;
          }
          h2 {
            font-size: 24px;
            margin: 30px 0 20px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .menu-items-container {
            display: ${layout === 'grid' ? 'grid' : 'block'};
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .menu-item {
            margin-bottom: 20px;
            page-break-inside: avoid;
            display: flex;
            flex-direction: ${layout === 'grid' ? 'column' : 'row'};
            border-bottom: ${layout === 'list' ? '1px solid #eee' : 'none'};
            padding-bottom: ${layout === 'list' ? '15px' : '0'};
          }
          .menu-item-image {
            width: ${layout === 'grid' ? '100%' : '80px'};
            height: ${layout === 'grid' ? '120px' : '80px'};
            object-fit: cover;
            border-radius: 4px;
            margin-${layout === 'grid' ? 'bottom' : 'right'}: 15px;
          }
          .menu-item-content {
            flex: 1;
          }
          .menu-item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
          }
          .menu-item-name {
            font-weight: bold;
            font-size: 16px;
            margin: 0;
          }
          .menu-item-price {
            font-weight: bold;
            white-space: nowrap;
          }
          .menu-item-description {
            margin: 5px 0;
            font-size: 14px;
            color: #555;
          }
          .menu-item-tags {
            font-size: 12px;
            color: #777;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
          }
          .tag {
            background-color: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
          }
          .type-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 6px;
          }
          .veg {
            background-color: #4CAF50;
          }
          .non-veg {
            background-color: #F44336;
          }
          .category-description {
            font-size: 14px;
            color: #555;
            margin-bottom: 15px;
            font-style: italic;
          }
          .page-break {
            page-break-before: always;
          }
          footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
          .no-image-placeholder {
            width: ${layout === 'grid' ? '100%' : '80px'};
            height: ${layout === 'grid' ? '120px' : '80px'};
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            color: #999;
            font-size: 12px;
            margin-${layout === 'grid' ? 'bottom' : 'right'}: 15px;
          }
          .controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #fff;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
          }
          .print-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="controls">
          <button class="print-btn" onclick="window.print()">Print Menu</button>
        </div>
        
        <div class="container">
          <header>
            <h1 class="restaurant-name">${restaurantName}</h1>
            <p class="restaurant-tagline">Menu</p>
          </header>
    `);
    
    // Generate menu content by category (same as in print function)
    categories.forEach((category, i) => {
      // Add page break after every category (except the first)
      if (i > 0) {
        previewWindow.document.write('<div class="page-break"></div>');
      }
      
      const categoryItems = menuItems.filter(
        item => item.categoryId === category.id && item.available
      );
      
      if (categoryItems.length > 0) {
        previewWindow.document.write(`
          <section>
            <h2>${category.name}</h2>
            ${category.description ? `<p class="category-description">${category.description}</p>` : ''}
            <div class="menu-items-container">
        `);
        
        categoryItems.forEach(item => {
          previewWindow.document.write(`
            <div class="menu-item">
              ${showImages ? item.imageUrl ? 
                `<img src="${item.imageUrl}" alt="${item.name}" class="menu-item-image" />` :
                `<div class="no-image-placeholder">No Image</div>`
              : ''}
              <div class="menu-item-content">
                <div class="menu-item-header">
                  <p class="menu-item-name">
                    ${showVegLabels ? 
                      `<span class="type-indicator ${item.type === 'veg' ? 'veg' : 'non-veg'}"></span>` 
                      : ''}
                    ${item.name}
                  </p>
                  ${showPrices ? 
                    `<span class="menu-item-price">$${item.price.toFixed(2)}</span>` 
                    : ''}
                </div>
                ${showDescription && item.description ? 
                  `<p class="menu-item-description">${item.description}</p>` 
                  : ''}
                ${item.tags && item.tags.length > 0 ? 
                  `<div class="menu-item-tags">${
                    item.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')
                  }</div>` 
                  : ''}
              </div>
            </div>
          `);
        });
        
        previewWindow.document.write('</div></section>');
      }
    });
    
    // Footer
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    
    previewWindow.document.write(`
          <footer>
            <p>${restaurantName} • Menu updated on ${formattedDate}</p>
            <p>Thank you for dining with us!</p>
          </footer>
        </div>
      </body>
      </html>
    `);
    
    previewWindow.document.close();
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Print Menu
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Print Menu Options</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-prices">Show Prices</Label>
                    <Switch
                      id="show-prices"
                      checked={showPrices}
                      onCheckedChange={setShowPrices}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-descriptions">Show Descriptions</Label>
                    <Switch
                      id="show-descriptions"
                      checked={showDescription}
                      onCheckedChange={setShowDescription}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-images">Show Images</Label>
                    <Switch
                      id="show-images"
                      checked={showImages}
                      onCheckedChange={setShowImages}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-veg-labels">Show Veg/Non-Veg Indicators</Label>
                    <Switch
                      id="show-veg-labels"
                      checked={showVegLabels}
                      onCheckedChange={setShowVegLabels}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="layout" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Paper Size</Label>
                  <Select value={paperSize} onValueChange={setPaperSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select paper size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="letter">Letter (8.5" x 11")</SelectItem>
                      <SelectItem value="a4">A4 (210mm x 297mm)</SelectItem>
                      <SelectItem value="legal">Legal (8.5" x 14")</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Menu Layout</Label>
                  <Select value={layout} onValueChange={setLayout}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select layout style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid (2 columns)</SelectItem>
                      <SelectItem value="list">List (1 column)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={handlePreview} className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuPrint;
