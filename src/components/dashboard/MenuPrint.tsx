
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Category, MenuItem } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #333;
          }
          h1 {
            font-size: 28px;
            margin: 0;
          }
          h2 {
            font-size: 22px;
            margin: 25px 0 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
          }
          .menu-item {
            margin-bottom: 15px;
            page-break-inside: avoid;
          }
          .menu-item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }
          .menu-item-name {
            font-weight: bold;
            font-size: 16px;
            margin: 0;
          }
          .menu-item-price {
            font-weight: bold;
          }
          .menu-item-description {
            margin: 5px 0;
            font-size: 14px;
            color: #555;
          }
          .menu-item-tags {
            font-size: 12px;
            color: #777;
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
          footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
          .page-break {
            page-break-before: always;
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
            <h1>${restaurantName}</h1>
          </header>
          
          <div class="no-print" style="text-align: center; margin-bottom: 20px;">
            <p>Press Ctrl+P or Cmd+P to print this menu.</p>
          </div>
    `);
    
    // Generate menu content by category
    categories.forEach((category, i) => {
      // Add page break after every 2 categories (except the first)
      if (i > 0 && i % 2 === 0) {
        printWindow.document.write('<div class="page-break"></div>');
      }
      
      const categoryItems = menuItems.filter(
        item => item.categoryId === category.id && item.available
      );
      
      if (categoryItems.length > 0) {
        printWindow.document.write(`
          <section>
            <h2>${category.name}</h2>
        `);
        
        categoryItems.forEach(item => {
          printWindow.document.write(`
            <div class="menu-item">
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
                `<p class="menu-item-tags">${item.tags.join(', ')}</p>` 
                : ''}
            </div>
          `);
        });
        
        printWindow.document.write('</section>');
      }
    });
    
    // Footer
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    
    printWindow.document.write(`
          <footer>
            <p>Menu updated on ${formattedDate}</p>
          </footer>
        </div>
        <script>
          setTimeout(() => { window.print(); }, 500);
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
          
          <div className="py-4 space-y-4">
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
                <Label htmlFor="show-veg-labels">Show Veg/Non-Veg Indicators</Label>
                <Switch
                  id="show-veg-labels"
                  checked={showVegLabels}
                  onCheckedChange={setShowVegLabels}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handlePrint}>Generate Printable Menu</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuPrint;
