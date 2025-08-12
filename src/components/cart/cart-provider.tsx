

'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

// The cart now needs to store the original product ID to handle quantity updates,
// but the price might be the discounted one.
export interface CartItem {
  id: string; // Product ID
  name: string;
  emoji: string;
  pricePerKg: number; // This can be the original or discounted price
  quantity: number;
}


export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY_PREFIX = 'madras_sandhai_cart_';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  
  const getStorageKey = useCallback(() => {
    return user ? `${CART_STORAGE_KEY_PREFIX}${user.uid}` : null;
  }, [user]);

  useEffect(() => {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    try {
      const storedCart = localStorage.getItem(storageKey);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      setItems([]);
    }
  }, [getStorageKey]);

  useEffect(() => {
    const storageKey = getStorageKey();
    if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, getStorageKey]);

  const addToCart = (product: Product, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // If item exists, update its quantity.
        // We assume the price is the same if re-added, which is fine for this use case.
        // A more complex cart might need to handle price changes on re-add.
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Add new item to cart
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        emoji: product.emoji,
        pricePerKg: product.pricePerKg, // This will be the discounted price if applicable
        quantity: quantity,
      }
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => acc + (item.pricePerKg * item.quantity), 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
