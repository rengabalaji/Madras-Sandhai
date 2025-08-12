
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { mockOrders, mockProducts } from '@/lib/mock-data';
import { Order, OrderStatus } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/dashboard/order-status-badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Check, Truck, XCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTime } from '@/hooks/use-time';
import { useLocalization } from '@/hooks/use-localization';

export default function OrdersPage() {
  const { user, isVendor } = useAuth();
  const { toast } = useToast();
  const { simulatedTime } = useTime();
  const { t } = useLocalization();

  const getInitialOrders = () => {
    const userOrders = isVendor
    ? mockOrders.filter((o) => o.vendorId === user?.uid)
    : mockOrders.filter((o) => o.supplierId === user?.uid);

    return userOrders.map(order => {
        const product = mockProducts.find(p => p.id === order.productId);
        return {
            ...order,
            supplierName: product ? product.supplierName : 'N/A',
        };
    }).sort((a, b) => b.orderDate - a.orderDate);
  }
  
  const [orders, setOrders] = useState<Order[]>(getInitialOrders());

  useEffect(() => {
    // Refresh orders when simulated time changes to reflect new statuses
    setOrders(getInitialOrders());
  }, [simulatedTime, user?.uid, isVendor]);

  const title = isVendor ? t('ordersPage_title_vendor') : t('ordersPage_title_supplier');
  const description = isVendor
    ? t('ordersPage_description_vendor')
    : t('ordersPage_description_supplier');

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    // Find the order in the master mock data and update it
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
      const originalOrder = mockOrders[orderIndex];

      // If approving a pending order, deduct stock
      if (newStatus === 'Packed' && originalOrder.status === 'Pending') {
        const productIndex = mockProducts.findIndex(p => p.id === originalOrder.productId);
        if (productIndex > -1) {
          const product = mockProducts[productIndex];
          if (product.stockKg >= originalOrder.quantity) {
             product.stockKg -= originalOrder.quantity;
          } else {
            toast({
              variant: 'destructive',
              title: t('ordersPage_toast_approvalFailed_title'),
              description: t('ordersPage_toast_approvalFailed_description', { productName: product.name }),
            });
            return; // Stop the status update
          }
        }
      }

      // If order is cancelled after being approved, restore stock
      if (newStatus === 'Cancelled' && (originalOrder.status === 'Packed' || originalOrder.status === 'Shipped')) {
        const productIndex = mockProducts.findIndex(p => p.id === originalOrder.productId);
        if (productIndex > -1) {
          mockProducts[productIndex].stockKg += originalOrder.quantity;
        }
      }

      mockOrders[orderIndex].status = newStatus;
       if (newStatus === 'Delivered') {
        mockOrders[orderIndex].deliveryEta = simulatedTime;
      }
    }
    
    // Refresh the local state to re-render the UI
    setOrders(getInitialOrders());

    toast({
      title: t('ordersPage_toast_orderUpdated_title'),
      description: t('ordersPage_toast_orderUpdated_description', { orderId: orderId.slice(0, 7), status: newStatus }),
    });
  };

  const renderActionButtons = (order: Order) => {
    switch (order.status) {
      case 'Pending':
        return (
          <>
            <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(order.id, 'Cancelled')}>
                <XCircle className="mr-2 h-4 w-4" />
                {t('ordersPage_action_deny')}
            </Button>
            <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'Packed')}>
                <Check className="mr-2 h-4 w-4" />
                {t('ordersPage_action_approve')}
            </Button>
          </>
        );
      case 'Packed':
        return (
          <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'Shipped')}>
            <Truck className="mr-2 h-4 w-4" />
            {t('ordersPage_action_ship')}
          </Button>
        );
      case 'Shipped':
         return (
          <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'Delivered')}>
            <Check className="mr-2 h-4 w-4" />
            {t('ordersPage_action_deliver')}
          </Button>
        );
      default:
        return null;
    }
  };

  const getOrderStatus = (order: Order): OrderStatus => {
    if (order.status === 'Shipped' && simulatedTime >= order.deliveryEta) {
      // Automatically mark as delivered if the ETA has passed
      const orderIndex = mockOrders.findIndex(o => o.id === order.id);
      if (orderIndex > -1 && mockOrders[orderIndex].status !== 'Delivered') {
        mockOrders[orderIndex].status = 'Delivered';
        return 'Delivered';
      }
    }
    return order.status;
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('ordersPage_history_title')}</CardTitle>
          <CardDescription>{t('ordersPage_history_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('ordersPage_tableHeader_orderId')}</TableHead>
                <TableHead>{t('ordersPage_tableHeader_product')}</TableHead>
                {isVendor ? <TableHead>{t('ordersPage_tableHeader_supplier')}</TableHead> : <TableHead>{t('ordersPage_tableHeader_vendor')}</TableHead>}
                <TableHead>{t('ordersPage_tableHeader_location')}</TableHead>
                <TableHead className="text-right">{t('ordersPage_tableHeader_quantity')}</TableHead>
                <TableHead className="text-right">{t('ordersPage_tableHeader_totalPrice')}</TableHead>
                <TableHead>{t('ordersPage_tableHeader_payment')}</TableHead>
                <TableHead>{t('ordersPage_tableHeader_orderDate')}</TableHead>
                <TableHead>{t('ordersPage_tableHeader_orderTime')}</TableHead>
                <TableHead>{t('ordersPage_tableHeader_deliveryEta')}</TableHead>
                <TableHead className="text-center">{t('ordersPage_tableHeader_status')}</TableHead>
                {!isVendor && <TableHead className="text-right">{t('ordersPage_tableHeader_actions')}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => {
                  const currentStatus = getOrderStatus(order);
                  return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.slice(0, 7)}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell>{isVendor ? order.supplierName : order.vendorName}</TableCell>
                    <TableCell>{order.deliveryLocation}</TableCell>
                    <TableCell className="text-right">{order.quantity}</TableCell>
                    <TableCell className="text-right">₹{order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.paymentMethod === 'COD' ? <Truck className="h-4 w-4 text-muted-foreground" /> : <CreditCard className="h-4 w-4 text-muted-foreground" />}
                        <span>{order.paymentMethod}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(order.orderDate), 'PPP')}</TableCell>
                    <TableCell>{format(new Date(order.orderDate), 'p')}</TableCell>
                    <TableCell>{format(new Date(order.deliveryEta), 'PPP')}</TableCell>
                    <TableCell className="text-center">
                      <OrderStatusBadge status={currentStatus} />
                    </TableCell>
                     {!isVendor && (
                      <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {renderActionButtons(order)}
                          </div>
                      </TableCell>
                    )}
                  </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={isVendor ? 11 : 12} className="h-24 text-center">
                    {t('ordersPage_noOrders')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
