import Navigation from '@/components/client/NavBar';
import CardLayout from '@/components/ui/CardLayout';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow contents">
        <CardLayout>{children}</CardLayout>
      </main>
    </div>
  );
}
