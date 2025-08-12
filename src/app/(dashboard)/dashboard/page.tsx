
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockOrders, mockProducts } from '@/lib/mock-data';
import { Truck, Package, PackageCheck, AlertTriangle, Bot } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/hooks/use-localization';

export default function DashboardPage() {
  const { user, isVendor, isSupplier } = useAuth();
  const { t } = useLocalization();

  const userOrders = isVendor
    ? mockOrders.filter((o) => o.vendorId === user?.uid)
    : mockOrders.filter((o) => o.supplierId === user?.uid);

  const pendingOrders = userOrders.filter((o) => o.status === 'Pending').length;
  const activeOrders = userOrders.filter(
    (o) => o.status === 'Packed' || o.status === 'Shipped'
  ).length;
  const completedOrders = userOrders.filter((o) => o.status === 'Delivered').length;

  const supplierProducts = isSupplier ? mockProducts.filter(p => p.supplierId === user?.uid) : [];
  const lowStockProducts = supplierProducts.filter(p => p.stockKg < 10).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline">{t('dashboardPage_welcome', { name: user?.name })}</h1>
        <p className="text-muted-foreground">{t('dashboardPage_description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboardPage_card_pendingOrders_title')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboardPage_card_activeOrders_title')}</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboardPage_card_completedOrders_title')}</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
          </CardContent>
        </Card>
        {isSupplier && (
            <Card className={lowStockProducts > 0 ? "border-destructive" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('dashboardPage_card_lowStock_title')}</CardTitle>
                    <AlertTriangle className={`h-4 w-4 ${lowStockProducts > 0 ? "text-destructive" : "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{lowStockProducts}</div>
                    <p className="text-xs text-muted-foreground">{t('dashboardPage_card_lowStock_description')}</p>
                </CardContent>
            </Card>
        )}
      </div>

       {isSupplier && (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('dashboardPage_card_inventory_title')}</CardTitle>
                <CardDescription>{t('dashboardPage_card_inventory_description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/dashboard/inventory">
                    <Button>{t('dashboardPage_card_inventory_button')}</Button>
                </Link>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
