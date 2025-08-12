
'use client';

import { useAuth } from '@/hooks/use-auth';
import { mockProducts } from '@/lib/mock-data';
import { ProductCard } from '@/components/dashboard/product-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalization } from '@/hooks/use-localization';

export default function InventoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocalization();

  const handleEdit = (productId: string) => {
    toast({
      title: t('productsPage_toast_edit_title'),
      description: t('productsPage_toast_edit_description', { productId }),
    });
  };

  const supplierProducts = mockProducts.filter((p) => p.supplierId === user?.uid);
  const categories = ['All', ...Array.from(new Set(supplierProducts.map(p => p.category)))];

  const renderProductGrid = (products: Product[]) => (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isVendor={false}
              onAddToCart={() => {}} // No-op for suppliers
              onEdit={handleEdit}
              onSelectSupplier={() => {}} // No-op for suppliers
            />
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card">
          <div className="text-center">
            <h3 className="font-headline text-xl">{t('productsPage_noProducts_title')}</h3>
            <p className="text-muted-foreground">
              {t('productsPage_noProducts_description_supplier')}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => toast({ title: t('productsPage_toast_comingSoon_title'), description: t('productsPage_toast_comingSoon_description') })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('productsPage_addProduct_button')}
            </Button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-headline">{t('productsPage_title_supplier')}</h1>
          <p className="text-muted-foreground">{t('productsPage_description_supplier')}</p>
        </div>
        <Button onClick={() => toast({ title: t('productsPage_toast_comingSoon_title'), description: t('productsPage_toast_comingSoon_description') })}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('productsPage_addNewProduct_button')}
        </Button>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <TabsList>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{t(`category_${category}`)}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="All" className="mt-6">
            {renderProductGrid(supplierProducts)}
        </TabsContent>

        {categories.slice(1).map(category => (
            <TabsContent key={category} value={category} className="mt-6">
                {renderProductGrid(supplierProducts.filter(p => p.category === category))}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
