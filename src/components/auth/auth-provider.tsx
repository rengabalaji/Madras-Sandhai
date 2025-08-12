
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isVendor: boolean;
  isSupplier: boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signOut: () => void;
  signUp: (details: Omit<User, 'uid' | 'createdAt' | 'verified'>) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'madras_sandhai_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const signIn = async (email: string, pass: string): Promise<boolean> => {
    // In a real app, you'd call Firebase auth here.
    // We'll just find the user in our mock data. Password is ignored.
    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser) {
      updateUser(foundUser);
      return true;
    }
    return false;
  };

  const signOut = () => {
    // In a real app, call Firebase signOut.
    updateUser(null);
  };

  const signUp = async (details: Omit<User, 'uid' | 'createdAt' | 'verified'>): Promise<boolean> => {
    const existingUser = mockUsers.find((u) => u.email === details.email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }
    
    // Create a new user and sign them in
    const newUser: User = {
      ...details,
      uid: `new_user_${Date.now()}`,
      createdAt: Date.now(),
      verified: false, // verification would be a separate step
    };
    
    mockUsers.push(newUser); // Add to our mock DB
    updateUser(newUser);

    return true;
  }

  const isVendor = user?.role === 'vendor';
  const isSupplier = user?.role === 'supplier';

  const value = {
    user,
    loading,
    isVendor,
    isSupplier,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
