
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Bot,
  LogOut,
  User as UserIcon,
  Percent,
  Calendar,
  CloudSun,
  ClipboardList,
} from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { User } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTime } from '@/hooks/use-time';
import { useLocalization } from '@/hooks/use-localization';

interface SidebarNavProps {
  user: User;
  onSignOut: () => void;
}

export function SidebarNav({ user, onSignOut }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { simulatedTime } = useTime();
  const { t } = useLocalization();

  const handleSignOut = () => {
    onSignOut();
    router.replace('/');
  };
  
  const date = new Date(simulatedTime);
  const day = date.getDay(); // Sunday = 0, Saturday = 6
  const isWeekend = day === 0 || day === 6;

  const navItems = [
    { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard, roles: ['vendor', 'supplier'] },
    { href: '/dashboard/products', labelKey: 'sidebar_browseProducts', icon: Package, roles: ['vendor'] },
    { href: '/dashboard/inventory', labelKey: 'sidebar_myProducts', icon: ClipboardList, roles: ['supplier'] },
    { href: '/dashboard/orders', labelKey: 'sidebar_orders', icon: ShoppingCart, roles: ['vendor', 'supplier'] },
    { href: '/dashboard/offers', labelKey: 'sidebar_specialOffers', icon: Percent, roles: ['vendor'] },
  ];
  

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map(
            (item) =>
              item.roles.includes(user.role) && (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      tooltip={t(item.labelKey)}
                    >
                      <item.icon />
                      <span>{t(item.labelKey)}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
         <div className="flex items-center gap-3 rounded-md p-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
                <p className="truncate font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
          <LogOut />
          <span>{t('sidebar_logout')}</span>
        </Button>
      </SidebarFooter>
    </>
  );
}
