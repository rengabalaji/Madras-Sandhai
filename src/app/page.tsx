
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalization } from '@/hooks/use-localization';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  language: z.string(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { locale, setLocale, t } = useLocalization();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      language: locale,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      // Set language first
      setLocale(values.language as 'en' | 'ta');
      
      const success = await signIn(values.email, values.password);
      if (success) {
        const loggedInUser = mockUsers.find(u => u.email === values.email);
        toast({
          title: t('loginPage_toast_success_title'),
          description: t('loginPage_toast_success_description', { name: loggedInUser?.name || '' }),
        });
        router.push('/dashboard');
      } else {
        throw new Error(t('loginPage_toast_failure_description'));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('loginPage_toast_failure_title'),
        description:
          error instanceof Error
            ? error.message
            : t('loginPage_toast_failure_unknownError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="font-headline text-3xl">{t('loginPage_title')}</CardTitle>
            <CardDescription>{t('loginPage_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('loginPage_language_label')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('loginPage_language_placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">{t('loginPage_language_english')}</SelectItem>
                          <SelectItem value="ta">{t('loginPage_language_tamil')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('loginPage_email_label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('loginPage_email_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('loginPage_password_label')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('loginPage_button_submitting')}
                    </>
                  ) : (
                    <>
                      {t('loginPage_button_submit')} <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              {t('loginPage_signup_prompt')}{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                {t('loginPage_signup_link')}
              </Link>
            </div>
             <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/accounts" className="hover:underline">
                {t('loginPage_mockAccounts_link')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
