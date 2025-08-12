
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { mockOrders, mockProducts } from '@/lib/mock-data';
import { Order, PaymentMethod } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle, AlertTriangle, Home, CreditCard, Truck, User, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTime } from '@/hooks/use-time';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, clearCart, removeFromCart, total } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const { simulatedTime } = useTime();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState(user?.location || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');

  useEffect(() => {
    // This effect runs on mount and whenever `items` changes.
    // It checks for out-of-stock items and displays an error if found.
    const unavailableItems = items.filter(item => {
        const product = mockProducts.find(p => p.id === item.id);
        return !product || product.stockKg < item.quantity;
    });

    if (unavailableItems.length > 0) {
        setError(`Some items are unavailable or have insufficient stock. Please review your cart.`);
        // Optionally remove unavailable items from cart automatically
        unavailableItems.forEach(item => removeFromCart(item.id));
    } else {
        setError(null);
    }
  }, [items, removeFromCart]);

  useEffect(() => {
    // This effect handles redirection if the cart becomes empty.
    if (!isSubmitting && items.length === 0) {
      router.replace('/dashboard/products');
    }
  }, [items, isSubmitting, router]);
  

  const handlePlaceOrder = () => {
    if (!user || !deliveryLocation || !contactName || !contactPhone) return;
    setIsSubmitting(true);
    
    // Check stock one last time before placing order
    const unavailableItems = items.filter(item => {
        const product = mockProducts.find(p => p.id === item.id);
        return !product || product.stockKg < item.quantity;
    });

    if (unavailableItems.length > 0) {
        toast({
            variant: 'destructive',
            title: 'Order Failed!',
            description: `Some items in your cart just went out of stock. Please review your cart.`,
        });
        unavailableItems.forEach(item => removeFromCart(item.id));
        setIsSubmitting(false);
        return;
    }

    // In a real app, this would be a single API call to a backend.
    // Here we simulate creating multiple orders without updating stock yet.
    const newOrders: Order[] = items.map(item => {
        const product = mockProducts.find(p => p.id === item.id);
        if (!product) throw new Error('Product not found during order creation.');
        
        return {
            id: `order_${Date.now()}_${Math.random()}`,
            vendorId: user.uid,
            vendorName: user.name,
            supplierId: product.supplierId,
            supplierName: product.supplierName,
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            totalPrice: item.quantity * item.pricePerKg, // Use price from cart item
            status: 'Pending',
            orderDate: simulatedTime,
            deliveryEta: simulatedTime + 86400000 * 3, // 3 days from now
            deliveryLocation: deliveryLocation,
            paymentMethod: paymentMethod,
        }
    });

    // Add new orders to the mock data
    mockOrders.unshift(...newOrders);

    setTimeout(() => {
        toast({
          title: 'Order Placed Successfully!',
          description: `Your ${newOrders.length} new order(s) are now pending.`,
        });
        clearCart();
        setIsSubmitting(false);
        router.push('/dashboard/orders');
    }, 1500); // Simulate network delay
  };
  
  // Render a loading state or null while redirecting
  if (items.length === 0 && !isSubmitting) {
    return (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline">Checkout</h1>
        <p className="text-muted-foreground">Review your items and place your order.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Cart Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="location">Delivery Address</Label>
                        <div className="relative">
                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="location"
                                value={deliveryLocation}
                                onChange={(e) => setDeliveryLocation(e.target.value)}
                                placeholder="Enter your full delivery address"
                                className="pl-10"
                            />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="name"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="Enter your full name"
                                className="pl-10"
                            />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="phone"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                placeholder="Enter your phone number"
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Select how you would like to pay.</CardDescription>
                </CardHeader>
                <CardContent>
                   <RadioGroup 
                        value={paymentMethod}
                        onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                        <Label htmlFor="cod" className={cn(
                            "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                            paymentMethod === 'COD' && 'border-primary'
                        )}>
                            <RadioGroupItem value="COD" id="cod" className="sr-only" />
                            <Truck className="mb-3 h-6 w-6" />
                            Cash on Delivery
                        </Label>
                         <Label htmlFor="online" className={cn(
                            "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                            paymentMethod === 'Online' && 'border-primary'
                        )}>
                            <RadioGroupItem value="Online" id="online" className="sr-only" />
                            <CreditCard className="mb-3 h-6 w-6" />
                            Online Payment
                        </Label>
                    </RadioGroup>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                     <div
                                        className="h-16 w-16 rounded-md bg-muted flex items-center justify-center text-3xl"
                                     >
                                        {item.emoji}
                                     </div>
                                     <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} kg x ₹{item.pricePerKg.toFixed(2)}
                                        </p>
                                     </div>
                                </div>
                                <p className="font-semibold">₹{(item.quantity * item.pricePerKg).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle>Finalize Order</CardTitle>
                    <CardDescription>Ready to go?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes & Fees</span>
                        <span>Calculated at next step</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                    <Button 
                        className="w-full" 
                        size="lg" 
                        onClick={handlePlaceOrder} 
                        disabled={isSubmitting || !!error || items.length === 0 || !deliveryLocation || !contactName || !contactPhone}
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                <CheckCircle className="mr-2" />
                                Place Order
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
