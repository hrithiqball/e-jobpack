import '@/app/globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import { Toaster } from 'sonner';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Asset Management System',
  description: 'A digital asset management system solution for your business.',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col h-screen">
            <div className="flex-1">
              {children}
              <Toaster richColors />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
