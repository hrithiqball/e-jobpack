import '@/app/globals.css';
import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import { Toaster } from 'sonner';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'eJobpack',
  description: 'A digital asset management system solution for your business.',
  icons: { icon: '/app/favicon.ico' },
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col h-screen">
            <div className="flex flex-1">
              {children}
              <Toaster richColors />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
