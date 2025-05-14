
import React from 'react';
import { Deal } from '../types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface DealBannerProps {
  deal: Deal;
  onClick?: () => void;
}

const DealBanner: React.FC<DealBannerProps> = ({ deal, onClick }) => {
  const isValid = new Date() >= new Date(deal.validFrom) && new Date() <= new Date(deal.validTo);
  
  const handleViewDeal = () => {
    if (onClick) {
      onClick();
    } else {
      // Instead of navigating to a non-existent route, show the deal details in a toast
      toast({
        title: deal.name,
        description: `${deal.description} - Valid until ${new Date(deal.validTo).toLocaleDateString()}`,
        duration: 5000
      });
    }
  };
  
  return (
    <div 
      className={`relative p-4 rounded-lg border border-border animate-fade-in 
        ${isValid ? 'bg-accent/20' : 'bg-muted/50'}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-medium">{deal.name}</h3>
            {!isValid && (
              <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                Expired
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{deal.description}</p>
          
          <div className="text-sm mb-3">
            <span className="font-medium text-accent-foreground">
              {deal.discountType === 'percentage' 
                ? `${deal.discountValue}% off` 
                : `$${deal.discountValue} off`}
            </span>
            <span className="text-muted-foreground ml-2">
              Valid until {new Date(deal.validTo).toLocaleDateString()}
            </span>
          </div>
          
          {deal.items && deal.items.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {deal.items.map((item) => (
                <span key={item.id} className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                  {item.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <Button
          variant={isValid ? "default" : "outline"}
          onClick={handleViewDeal}
          className="whitespace-nowrap"
          disabled={!isValid}
        >
          View Deal
        </Button>
      </div>
    </div>
  );
};

export default DealBanner;
