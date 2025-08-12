
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Trash2, Plus, Minus, XCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { useLocalization } from '@/hooks/use-localization';

export function CartSheet() {
  const { items, itemCount, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useLocalization();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full p-0"
            >
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">{t('cartSheet_openCart_aria')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>{t('cartSheet_title', { count: itemCount })}</SheetTitle>
        </SheetHeader>
        
        {items.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto px-6">
                <div className="my-4 flex flex-col gap-6">
                    {items.map(item => (
                        <div key={item.id} className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="h-20 w-20 bg-muted rounded-md flex items-center justify-center text-4xl">
                                    {item.emoji}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {t('cartSheet_item_pricePerKg', { price: item.pricePerKg.toFixed(2) })}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                            className="h-8 w-14 text-center"
                                        />
                                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
            <SheetFooter className="bg-background border-t p-6 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                    <span>{t('cartSheet_subtotal')}</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-center text-muted-foreground">{t('cartSheet_taxesAndShipping')}</p>
                <div className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <Link href="/dashboard/checkout" className="w-full">
                        <Button size="lg" className="w-full" disabled={items.length === 0}>{t('cartSheet_checkout_button')}</Button>
                      </Link>
                    </SheetClose>
                    <Button variant="outline" size="lg" onClick={clearCart}>{t('cartSheet_clearCart_button')}</Button>
                </div>
            </SheetFooter>
          </>
        ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                 <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <XCircle className="h-12 w-12" />
                 </div>
                <h3 className="font-headline text-xl">{t('cartSheet_empty_title')}</h3>
                <p className="text-muted-foreground">{t('cartSheet_empty_description')}</p>
                <SheetClose asChild>
                    <Link href="/dashboard/products">
                      <Button>{t('cartSheet_empty_browse_button')}</Button>
                    </Link>
                </SheetClose>
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
