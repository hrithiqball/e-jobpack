import { Suspense } from 'react';

import Dashboard from './_dashboard';
import { Loader } from '@/components/ui/loader';

export default async function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={<Loader />}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
