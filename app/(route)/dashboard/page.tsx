import { Suspense } from 'react';

import Dashboard from './Dashboard';

export default async function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
