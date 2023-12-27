import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import Navigation from '@/components/client/Navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { Toaster } from 'sonner';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Asset Management System',
  description: 'A digital asset management system solution for your business.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col h-screen">
            {session && <Navigation />}
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
