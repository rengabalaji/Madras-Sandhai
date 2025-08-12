
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { CartProvider } from '@/components/cart/cart-provider';
import { TimeProvider } from '@/components/time/time-provider';
import { LocalizationProvider } from '@/components/localization/localization-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <LocalizationProvider>
      <TimeProvider>
        <CartProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar>
                  <SidebarNav user={user} onSignOut={signOut} />
                </Sidebar>
                <SidebarInset>
                  <div className="flex flex-1 flex-col">
                    <DashboardHeader />
                    <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
                  </div>
                </SidebarInset>
              </div>
            </SidebarProvider>
        </CartProvider>
      </TimeProvider>
    </LocalizationProvider>
  );
}
