import { Suspense } from 'react';

import Dashboard from './_dashboard';
import { Loader } from '@/components/ui/loader';
import { getHistories } from '@/data/history.action';

export default async function DashboardPage() {
  const histories = await getHistories();

  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={<Loader />}>
        <Dashboard histories={histories} />
      </Suspense>
    </div>
  );
}
