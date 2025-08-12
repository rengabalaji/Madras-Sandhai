
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { Edit, ShoppingCart, Layers } from 'lucide-react';
import { useLocalization } from '@/hooks/use-localization';
import { SupplierChoiceCard } from './supplier-choice-card';


interface GroupedProduct {
  name: string;
  emoji: string;
  category: string;
  listings: Product[];
}

interface GroupedProductCardProps {
  product: GroupedProduct;
  isVendor: boolean;
  onEdit: (productId: string) => void;
}

export function GroupedProductCard({ product, isVendor, onEdit }: GroupedProductCardProps) {
  const { t } = useLocalization();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const lowestPrice = Math.min(...product.listings.map(p => p.pricePerKg));
  const totalStock = product.listings.reduce((sum, p) => sum + p.stockKg, 0);

  const outOfStock = totalStock <= 0;

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full bg-muted flex items-center justify-center">
              <span className="text-7xl">{product.emoji}</span>
          </div>
          <div className="p-6 pb-2">
              <Badge variant="secondary" className="mb-2">{t(`category_${product.category}`)}</Badge>
              <CardTitle className="font-headline text-xl">{t(`productName_${product.listings[0].id}`, {}, product.name)}</CardTitle>
              <CardDescription>{t('groupedProduct_suppliers_available', { count: product.listings.length })}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6 pt-2">
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
                <span className="text-muted-foreground text-sm">{t('groupedProduct_starting_from')}</span>
                <span className="text-2xl font-bold text-primary">₹{lowestPrice.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">{t('productCard_perKg')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers className="h-4 w-4 shrink-0" />
              <span>{t('groupedProduct_total_stock', { stock: totalStock.toFixed(0) })}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4">
          {isVendor ? (
            <Button className="w-full" onClick={() => setIsDialogOpen(true)} disabled={outOfStock}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {outOfStock ? t('productCard_outOfStock_button') : t('groupedProduct_view_suppliers')}
            </Button>
          ) : (
            // This part is for a single listing view on the supplier side, might need adjustment
             <Button variant="outline" className="w-full" onClick={() => onEdit(product.listings[0].id)}>
              <Edit className="mr-2 h-4 w-4" />
              {t('productCard_editProduct_button')}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {isVendor && (
         <SupplierChoiceCard 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            productName={product.name}
            emoji={product.emoji}
            listings={product.listings}
         />
      )}
    </>
  );
}
