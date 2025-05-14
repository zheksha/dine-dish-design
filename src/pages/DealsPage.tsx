
import React from 'react';
import { useDeals } from '../hooks/useDeals';
import CustomerLayout from '../layouts/CustomerLayout';
import DealBanner from '../components/DealBanner';
import { Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DealsPage: React.FC = () => {
  const { deals, isLoading } = useDeals();
  
  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="layout-container py-16">
          <div className="text-center">
            <p>Loading deals...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }
  
  // Separate active and inactive deals
  const now = new Date();
  const activeDeals = deals.filter(
    deal => new Date(deal.validFrom) <= now && new Date(deal.validTo) >= now
  );
  
  const inactiveDeals = deals.filter(
    deal => new Date(deal.validFrom) > now || new Date(deal.validTo) < now
  );

  const handleViewDeal = (deal: any) => {
    toast({
      title: deal.name,
      description: `${deal.description} - Valid until ${new Date(deal.validTo).toLocaleDateString()}`,
      duration: 5000
    });
  };

  return (
    <CustomerLayout>
      <div className="layout-container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Tag className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Special Deals & Offers</h1>
        </div>
        
        {deals.length === 0 ? (
          <div className="py-16 text-center">
            <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-xl font-medium">No deals available</h2>
            <p className="text-muted-foreground">
              Check back later for special offers.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {activeDeals.length > 0 && (
              <section>
                <h2 className="text-xl font-medium mb-4">Active Deals</h2>
                <div className="space-y-4">
                  {activeDeals.map(deal => (
                    <DealBanner 
                      key={deal.id} 
                      deal={deal}
                      onClick={() => handleViewDeal(deal)}
                    />
                  ))}
                </div>
              </section>
            )}
            
            {inactiveDeals.length > 0 && (
              <section>
                <h2 className="text-xl font-medium mb-4">
                  {activeDeals.length > 0 ? 'Other Deals' : 'Upcoming & Past Deals'}
                </h2>
                <div className="space-y-4">
                  {inactiveDeals.map(deal => (
                    <DealBanner key={deal.id} deal={deal} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default DealsPage;
