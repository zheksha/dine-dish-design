
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Download, Printer } from 'lucide-react';
import QRCode from 'qrcode.react';

interface RestaurantQRCodeProps {
  restaurantUrl: string;
  restaurantName: string;
}

const RestaurantQRCode: React.FC<RestaurantQRCodeProps> = ({ restaurantUrl, restaurantName }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadSVG = () => {
    const svgElement = qrCodeRef.current?.querySelector('svg');
    if (!svgElement) return;
    
    // Create a clone of the SVG to modify
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
    
    // Add some padding to the SVG
    const originalWidth = parseInt(svgClone.getAttribute('width') || '256');
    const padding = 20;
    const newWidth = originalWidth + (padding * 2);
    
    svgClone.setAttribute('width', newWidth.toString());
    svgClone.setAttribute('height', newWidth.toString());
    
    // Add title/text at the bottom
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.textContent = restaurantName;
    title.setAttribute('x', (newWidth / 2).toString());
    title.setAttribute('y', (newWidth - 5).toString());
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-family', 'Arial, sans-serif');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    
    // Move the QR code down a bit to make room for the title
    const qrGroup = svgClone.querySelector('svg > g');
    if (qrGroup) {
      qrGroup.setAttribute('transform', `translate(${padding}, ${padding})`);
    }
    
    svgClone.appendChild(title);
    
    // Convert SVG to a data URL
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgClone);
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${restaurantName.replace(/\s+/g, '_')}_QR_Code.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "SVG Downloaded",
      description: "Your QR code has been downloaded as an SVG file"
    });
  };

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
    
    const svgElement = qrCodeRef.current?.querySelector('svg');
    if (!svgElement) return;
    
    const restaurantNameFormatted = restaurantName.replace(/\s+/g, ' ').trim();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${restaurantNameFormatted} - QR Code</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 40px;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
          }
          .qr-code {
            margin: 30px auto;
          }
          h1 {
            margin-bottom: 10px;
          }
          p {
            color: #666;
            margin-bottom: 30px;
          }
          .url {
            font-size: 14px;
            color: #555;
            word-break: break-all;
            margin-top: 20px;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${restaurantNameFormatted}</h1>
          <p>Scan this QR code to view our menu online</p>
          <div class="qr-code">
            ${svgElement.outerHTML}
          </div>
          <div class="url">${restaurantUrl}</div>
          <div class="no-print">
            <p style="margin-top: 40px;">Press Ctrl+P or Cmd+P to print this QR code.</p>
          </div>
        </div>
        <script>
          setTimeout(() => { window.print(); }, 500);
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <QrCode className="h-4 w-4" />
        Generate QR Code
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restaurant QR Code</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            <div ref={qrCodeRef} className="bg-white p-4 rounded-lg">
              <QRCode 
                value={restaurantUrl} 
                size={200}
                level="H"
                includeMargin={true}
                renderAs="svg"
              />
            </div>
            
            <p className="text-sm text-center text-muted-foreground mt-4 mb-2">
              Scan this code to view the restaurant menu
            </p>
            
            <p className="text-xs text-center break-all px-4 text-muted-foreground">
              {restaurantUrl}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-2">
            <Button variant="outline" onClick={handleDownloadSVG} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Save as SVG
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

export default RestaurantQRCode;
