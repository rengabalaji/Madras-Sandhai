
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/hooks/use-localization';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(['vendor', 'supplier'], { required_error: 'You must select a role.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const { t } = useLocalization();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'vendor',
      location: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    try {
        const { password, ...userDetails } = values;
        const success = await signUp(userDetails);
        if (success) {
            toast({
                title: t('signupPage_toast_success_title'),
                description: t('signupPage_toast_success_description'),
            });
            router.push('/dashboard');
        } else {
            throw new Error(t('signupPage_toast_failure_error'));
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: t('signupPage_toast_failure_title'),
            description: error instanceof Error ? error.message : t('signupPage_toast_failure_unknownError'),
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="font-headline text-3xl">{t('signupPage_title')}</CardTitle>
            <CardDescription>{t('signupPage_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t('signupPage_role_label')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="vendor" />
                            </FormControl>
                            <FormLabel className="font-normal">{t('signupPage_role_vendor')}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="supplier" />
                            </FormControl>
                            <FormLabel className="font-normal">{t('signupPage_role_supplier')}</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>{t('signupPage_name_label')}</FormLabel><FormControl><Input placeholder={t('signupPage_name_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>{t('signupPage_email_label')}</FormLabel><FormControl><Input placeholder={t('signupPage_email_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>{t('signupPage_phone_label')}</FormLabel><FormControl><Input placeholder="+91..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>{t('signupPage_location_label')}</FormLabel><FormControl><Input placeholder={t('signupPage_location_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>{t('signupPage_password_label')}</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
                   {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('signupPage_button_submitting')}</> : <>{t('signupPage_button_submit')} <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              {t('signupPage_login_prompt')}{' '}
              <Link href="/" className="font-semibold text-primary hover:underline">
                {t('signupPage_login_link')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
