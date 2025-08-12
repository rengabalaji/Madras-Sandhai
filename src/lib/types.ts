
export type UserRole = 'vendor' | 'supplier';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  verified: boolean;
  createdAt: number; // timestamp
}

export interface Product {
  id: string;
  name: string;
  category: string;
  pricePerKg: number;
  stockKg: number;
  emoji: string;
  supplierId: string;
  supplierName: string;
  deliveryRadiusKm: number;
  createdAt: number; // timestamp
}

export type OrderStatus = 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'COD' | 'Online';

export interface Order {
  id: string;
  vendorId: string;
  vendorName: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  orderDate: number; // timestamp
  deliveryEta: number; // timestamp
  deliveryLocation: string;
  paymentMethod: PaymentMethod;
}
