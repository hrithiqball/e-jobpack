import { PropsWithChildren } from 'react';

import NavigationBar from '@/components/navigation-bar';
import CardLayout from '@/components/ui/card';

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-1 flex-col">
      <NavigationBar />
      <main className="flex flex-1 flex-col">
        <CardLayout>{children}</CardLayout>
      </main>
    </div>
  );
}
