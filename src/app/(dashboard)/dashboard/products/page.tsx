
'use client';

import { useAuth } from '@/hooks/use-auth';
import { mockProducts } from '@/lib/mock-data';
import { GroupedProductCard } from '@/components/dashboard/grouped-product-card';
import type { Product } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalization } from '@/hooks/use-localization';

interface GroupedProduct {
  name: string;
  emoji: string;
  category: string;
  listings: Product[];
}

export default function ProductsPage() {
  const { t } = useLocalization();

  const groupProductsByName = (products: Product[]): GroupedProduct[] => {
    const productMap = new Map<string, GroupedProduct>();

    products.forEach(product => {
      if (!productMap.has(product.name)) {
        productMap.set(product.name, {
          name: product.name,
          emoji: product.emoji,
          category: product.category,
          listings: [],
        });
      }
      productMap.get(product.name)!.listings.push(product);
    });

    return Array.from(productMap.values());
  };

  const groupedProducts = groupProductsByName(mockProducts);

  const categories = ['All', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const renderProductGrid = (products: GroupedProduct[]) => (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <GroupedProductCard
              key={product.name}
              product={product}
              isVendor={true}
              onEdit={() => {}} // No-op for vendors
            />
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card">
          <div className="text-center">
            <h3 className="font-headline text-xl">{t('productsPage_noProducts_title')}</h3>
            <p className="text-muted-foreground">
              {t('productsPage_noProducts_description_vendor')}
            </p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-headline">{t('productsPage_title_vendor')}</h1>
          <p className="text-muted-foreground">{t('productsPage_description_vendor')}</p>
        </div>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <TabsList>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{t(`category_${category}`)}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="All" className="mt-6">
            {renderProductGrid(groupedProducts)}
        </TabsContent>

        {categories.slice(1).map(category => (
            <TabsContent key={category} value={category} className="mt-6">
                {renderProductGrid(groupedProducts.filter(p => p.category === category))}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
