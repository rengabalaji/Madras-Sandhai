
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/lib/mock-data';
import type { User, UserRole } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useLocalization } from '@/hooks/use-localization';

export default function AccountsPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { t } = useLocalization();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async (selectedUser: User) => {
    setIsSubmitting(selectedUser.uid);
    try {
      const success = await signIn(selectedUser.email, 'password'); // Password is not checked for mock users
      if (success) {
        toast({
          title: t('accountsPage_toast_loginSuccess_title'),
          description: t('accountsPage_toast_loginSuccess_description', { name: selectedUser.name }),
        });
        router.push('/dashboard');
      } else {
        throw new Error(t('accountsPage_toast_loginFailed_error'));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('accountsPage_toast_loginFailed_title'),
        description:
          error instanceof Error
            ? error.message
            : t('accountsPage_toast_loginFailed_unknownError'),
      });
       setIsSubmitting(null);
    }
  };

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const vendors = mockUsers.filter((u) => u.role === 'vendor');
  const suppliers = mockUsers.filter((u) => u.role === 'supplier');
  const accountsToShow = selectedRole === 'vendor' ? vendors : suppliers;

  const UserSelectionCard = ({ title, users }: { title: string; users: User[] }) => (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map((account) => (
          <div key={account.uid}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{account.name}</p>
                  <p className="text-sm text-muted-foreground">{account.email}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleLogin(account)}
                disabled={!!isSubmitting}
              >
                {isSubmitting === account.uid ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
                <span className="sr-only">{t('accountsPage_loginAs', { name: account.name })}</span>
              </Button>
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto mb-8 text-center">
         <div className="mx-auto mb-4 inline-block">
            <Logo />
         </div>
        <h1 className="font-headline text-3xl">{t('accountsPage_title')}</h1>
        <p className="text-muted-foreground">
          {selectedRole ? t('accountsPage_selectAccount') : t('accountsPage_selectRole')}
        </p>
      </div>

      <div className="w-full max-w-xl">
        {!selectedRole ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('accountsPage_chooseRole_title')}</CardTitle>
              <CardDescription>{t('accountsPage_chooseRole_description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button size="lg" className="h-16 text-lg" onClick={() => setSelectedRole('vendor')}>
                {t('accountsPage_role_vendor')}
              </Button>
              <Button size="lg" variant="secondary" className="h-16 text-lg" onClick={() => setSelectedRole('supplier')}>
                {t('accountsPage_role_supplier')}
              </Button>
            </CardContent>
             <CardContent>
                <div className="mt-4 text-center text-sm">
                    <Link href="/" className="font-semibold text-primary hover:underline">
                        {t('accountsPage_backToLogin')}
                    </Link>
                </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            <Button
              variant="ghost"
              onClick={() => setSelectedRole(null)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2" />
              {t('accountsPage_backToRoleSelection')}
            </Button>
            <UserSelectionCard
              title={selectedRole === 'vendor' ? t('accountsPage_vendorAccounts') : t('accountsPage_supplierAccounts')}
              users={accountsToShow}
            />
          </div>
        )}
      </div>
    </main>
  );
}
