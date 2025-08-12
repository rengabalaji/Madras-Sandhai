
'use client';

import { useAuth } from '@/hooks/use-auth';
import { mockProducts } from '@/lib/mock-data';
import { ProductCard } from '@/components/dashboard/product-card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { Percent, XCircle, Calendar, CloudSun, Box } from 'lucide-react';
import { useTime } from '@/hooks/use-time';
import { useLocalization } from '@/hooks/use-localization';

export default function OffersPage() {
  const { isVendor } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { simulatedTime } = useTime();
  const { t } = useLocalization();

  const handleAddToCart = (product: Product, price: number) => {
    const productWithOfferPrice = { ...product, pricePerKg: price };
    addToCart(productWithOfferPrice, 1);
    toast({
      title: t('offersPage_toast_addToCart_title'),
      description: t('offersPage_toast_addToCart_description', { productName: product.name }),
    });
  };

  const handleEdit = (productId: string) => {
    toast({
      title: t('offersPage_toast_edit_title'),
      description: t('offersPage_tost_edit_description', { productId }),
    });
  };

  const date = new Date(simulatedTime);
  const day = date.getDay(); // Sunday = 0, Saturday = 6
  const month = date.getMonth(); // 0 = January, 11 = December
  const isWeekend = day === 0 || day === 6;

  let season: 'Summer' | 'Monsoon' | 'Winter' = 'Summer';
  if (month >= 5 && month <= 8) { // June to September
    season = 'Monsoon';
  } else if (month >= 9 && month <= 11) { // October to December
    season = 'Winter';
  }
  
  // 1. Get all potential offers
  const seasonalProductIds = {
    'Summer': ['prod5', 'prod23', 'prod28'], // Cucumber, Coconut Oil, Yogurt
    'Monsoon': ['prod13', 'prod14', 'prod15'], // Lentils, Ginger, Garlic
    'Winter': ['prod3', 'prod4'] // Potatoes, Carrots
  }[season];

  const seasonalProducts = mockProducts
    .filter(p => seasonalProductIds.includes(p.id))
    .map(p => ({...p, offerType: 'seasonal' as const}));

  const weekendProducts = isWeekend 
    ? mockProducts
        .filter(p => ['Vegetables', 'Dairy'].includes(p.category))
        .map(p => ({...p, offerType: 'weekend' as const}))
    : [];
  
  const stockProducts = mockProducts
    .filter((p) => p.stockKg > 150)
    .map(p => ({...p, offerType: 'stock' as const}));

  // 2. De-duplicate offers with priority
  const offeredProductIds = new Set<string>();
  
  const finalSeasonalOffers = seasonalProducts.filter(p => {
    if (offeredProductIds.has(p.id)) return false;
    offeredProductIds.add(p.id);
    return true;
  });

  const finalWeekendOffers = weekendProducts.filter(p => {
    if (offeredProductIds.has(p.id)) return false;
    offeredProductIds.add(p.id);
    return true;
  });

  const finalStockOffers = stockProducts.filter(p => {
     if (offeredProductIds.has(p.id)) return false;
     offeredProductIds.add(p.id);
     return true;
  })

  const allOfferProducts = [...finalSeasonalOffers, ...finalWeekendOffers, ...finalStockOffers];

  const OfferSection = ({ title, icon, products, offerType }: { title: string, icon: React.ReactNode, products: (Product & { offerType: 'stock' | 'weekend' | 'seasonal' })[], offerType: 'stock' | 'weekend' | 'seasonal' }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">{icon}</div>
            <h2 className="text-2xl font-headline">{title}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={`${product.id}-${product.offerType}`}
                product={product}
                isVendor={!!isVendor}
                onAddToCart={handleAddToCart}
                onEdit={handleEdit}
                offerType={offerType}
              />
            ))}
        </div>
    </div>
  );


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline">{t('offersPage_title')}</h1>
        <p className="text-muted-foreground">{t('offersPage_description')}</p>
      </div>

      {allOfferProducts.length > 0 ? (
        <div className="space-y-12">
            {finalSeasonalOffers.length > 0 && (
                <OfferSection title={t('offersPage_seasonal_title', { season: t(`season_${season}`) })} icon={<CloudSun />} products={finalSeasonalOffers} offerType="seasonal" />
            )}
            {isWeekend && finalWeekendOffers.length > 0 && (
                 <OfferSection title={t('offersPage_weekend_title')} icon={<Calendar />} products={finalWeekendOffers} offerType="weekend" />
            )}
             {finalStockOffers.length > 0 && (
                 <OfferSection title={t('offersPage_otherDeals_title')} icon={<Box />} products={finalStockOffers} offerType="stock" />
            )}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card">
          <div className="text-center">
            <div className="rounded-full bg-primary/10 p-4 text-primary mx-auto w-fit mb-4">
              <Percent className="h-12 w-12" />
            </div>
            <h3 className="font-headline text-xl">{t('offersPage_noOffers_title')}</h3>
            <p className="text-muted-foreground">
              {t('offersPage_noOffers_description')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
