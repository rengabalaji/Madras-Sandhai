
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { LocalizationProvider } from '@/components/localization/localization-provider';

export const metadata: Metadata = {
  title: 'Madras Sandhai',
  description: 'Connecting street food vendors with local suppliers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'h-full font-body antialiased',
          '[--font-body:Alegreya] [--font-headline:Belleza]'
        )}
      >
        <LocalizationProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
