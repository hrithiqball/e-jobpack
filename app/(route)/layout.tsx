import { PropsWithChildren } from 'react';

import Navigation from '@/components/NavBar';
import CardLayout from '@/components/ui/CardLayout';

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-1 flex-col">
      <Navigation />
      <main className="flex flex-1 flex-col">
        <CardLayout>{children}</CardLayout>
      </main>
    </div>
  );
}
