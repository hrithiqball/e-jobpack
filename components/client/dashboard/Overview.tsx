import React from 'react';

import RecentActivity from '@/components/client/dashboard/RecentActivity';
import OverviewGraph from '@/components/client/dashboard/OverviewGraph';
import MaintenanceRequestWidget from '@/components/client/dashboard/MaintenanceRequestWidget';

export default function Overview() {
  return (
    <div className="flex grow h-full w-full">
      <div className="flex flex-col w-4/5">
        <div className="flex flex-1 p-2">
          <OverviewGraph />
        </div>
        <div className="flex flex-1 p-2">
          <MaintenanceRequestWidget />
        </div>
      </div>
      <div className="flex w-1/5 p-2">
        <RecentActivity />
      </div>
    </div>
  );
}
