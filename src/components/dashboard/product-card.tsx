
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { Truck, Package, Edit, ShoppingCart, Percent, CloudSun } from 'lucide-react';
import { useTime } from '@/hooks/use-time';
import { useLocalization } from '@/hooks/use-localization';

interface ProductCardProps {
  product: Product;
  isVendor: boolean;
  onAddToCart: (product: Product, price: number) => void;
  onEdit: (productId: string) => void;
  onSelectSupplier: () => void;
  offerType?: 'stock' | 'weekend' | 'seasonal';
}

export function ProductCard({ product, isVendor, onAddToCart, onEdit, onSelectSupplier, offerType }: ProductCardProps) {
  const { simulatedTime } = useTime();
  const { t } = useLocalization();
  const date = new Date(simulatedTime);
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  const month = date.getMonth(); // 0 = January, 11 = December
  
  const isWeekend = day === 0 || day === 6;

  let season: 'Summer' | 'Monsoon' | 'Winter' = 'Summer';
  if (month >= 5 && month <= 8) { // June to September
    season = 'Monsoon';
  } else if (month >= 9 && month <= 11) { // October to December
    season = 'Winter';
  }


  const hasStockOffer = product.stockKg > 150;
  const hasWeekendOffer = isWeekend && ['Vegetables', 'Dairy'].includes(product.category);

  const seasonalProducts = {
    'Summer': ['prod5', 'prod23', 'prod28'], // Cucumber, Coconut Oil, Yogurt
    'Monsoon': ['prod13', 'prod14', 'prod15'], // Lentils, Ginger, Garlic
    'Winter': ['prod3', 'prod4'] // Potatoes, Carrots
  }
  const hasSeasonalOffer = seasonalProducts[season].includes(product.id);

  let hasOffer = false;
  let offerPercentage = 0;
  let offerIcon = <Percent className="mr-1 h-4 w-4" />;

  if (offerType === 'stock' && hasStockOffer) {
    hasOffer = true;
    offerPercentage = 10;
  } else if (offerType === 'weekend' && hasWeekendOffer) {
    hasOffer = true;
    offerPercentage = 15;
  } else if (offerType === 'seasonal' && hasSeasonalOffer) {
    hasOffer = true;
    offerPercentage = 20;
    offerIcon = <CloudSun className="mr-1 h-4 w-4" />;
  } else if (offerType === undefined) {
    // Default behavior on products page
    if (hasStockOffer) {
      hasOffer = true;
      offerPercentage = 10;
    }
  }


  const discountedPrice = product.pricePerKg * (1 - offerPercentage / 100);
  const priceToUse = hasOffer ? discountedPrice : product.pricePerKg;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg relative">
      {hasOffer && (
        <Badge variant="destructive" className="absolute top-4 right-4 z-10">
          {offerIcon}
          {t('productCard_offerBadge', { percentage: offerPercentage })}
        </Badge>
      )}
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-muted flex items-center justify-center">
            <span className="text-7xl">{product.emoji}</span>
        </div>
        <div className="p-6 pb-2">
            <Badge variant="secondary" className="mb-2">{t(`category_${product.category}`)}</Badge>
            <CardTitle className="font-headline text-xl">{t(`productName_${product.id}`, {}, product.name)}</CardTitle>
            <CardDescription>{t('productCard_bySupplier', { supplierName: product.supplierName })}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            {hasOffer ? (
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">₹{discountedPrice.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{product.pricePerKg.toFixed(2)}</span>
                </div>
            ) : (
                <span className="text-2xl font-bold text-primary">₹{product.pricePerKg.toFixed(2)}</span>
            )}
            <span className="text-sm text-muted-foreground">{t('productCard_perKg')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4 shrink-0" />
            <span>{t('productCard_inStock', { stock: product.stockKg })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 shrink-0" />
            <span>{t('productCard_deliveryRadius', { radius: product.deliveryRadiusKm })}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        {isVendor ? (
          <Button className="w-full" onClick={onSelectSupplier} disabled={product.stockKg <= 0}>
             <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stockKg > 0 ? t('productCard_addToCart_button') : t('productCard_outOfStock_button')}
          </Button>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => onEdit(product.id)}>
            <Edit className="mr-2 h-4 w-4" />
            {t('productCard_editProduct_button')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
