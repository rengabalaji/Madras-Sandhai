
'use client';

import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Package, Truck, Star } from 'lucide-react';
import { useLocalization } from '@/hooks/use-localization';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface SupplierChoiceCardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  emoji: string;
  listings: Product[];
}

export function SupplierChoiceCard({ isOpen, onOpenChange, productName, emoji, listings }: SupplierChoiceCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { t } = useLocalization();

  const handleAddToCart = (listing: Product) => {
    addToCart(listing, 1);
    toast({
      title: t('productsPage_toast_addToCart_title'),
      description: t('productsPage_toast_addToCart_description', { productName: listing.name }),
    });
    onOpenChange(false); // Close dialog after adding to cart
  };

  const bestPrice = Math.min(...listings.map(l => l.pricePerKg));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="text-5xl">{emoji}</div>
            <div>
              <DialogTitle className="text-2xl font-headline">
                {t(`productName_${listings[0].id}`, {}, productName)}
              </DialogTitle>
              <DialogDescription>{t('supplierChoice_description')}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {listings
            .sort((a, b) => a.pricePerKg - b.pricePerKg)
            .map((listing) => (
            <div key={listing.id} className="p-4 rounded-lg border bg-card relative">
                 {listing.pricePerKg === bestPrice && (
                    <Badge className="absolute -top-3 left-3 flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {t('supplierChoice_bestPrice')}
                    </Badge>
                 )}
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{listing.supplierName}</p>
                         <p className="text-sm text-primary font-bold">₹{listing.pricePerKg.toFixed(2)} / kg</p>
                    </div>
                    <Button onClick={() => handleAddToCart(listing)} disabled={listing.stockKg <= 0} size="sm">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {listing.stockKg > 0 ? t('productCard_addToCart_button') : t('productCard_outOfStock_button')}
                    </Button>
                 </div>
                 <Separator className="my-3" />
                 <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Package className="h-4 w-4" />
                        <span>{t('productCard_inStock', { stock: listing.stockKg })}</span>
                    </div>
                     <div className="flex items-center gap-1.5">
                        <Truck className="h-4 w-4" />
                        <span>{t('productCard_deliveryRadius', { radius: listing.deliveryRadiusKm })}</span>
                    </div>
                 </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
