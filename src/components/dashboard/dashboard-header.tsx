
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '../logo';
import { useAuth } from '@/hooks/use-auth';
import { CartSheet } from './cart-sheet';
import { TimeTravel } from '../time/time-travel';

export function DashboardHeader() {
    const isMobile = useIsMobile();
    const { isVendor } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="md:hidden">
         <SidebarTrigger />
      </div>
      {isMobile && <div className="flex-1"><Logo /></div>}
      <div className="flex flex-1 items-center justify-end gap-4">
        <TimeTravel />
        {isVendor && <CartSheet />}
      </div>
    </header>
  );
}
