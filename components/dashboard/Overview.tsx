import React from 'react';

import RecentActivity from '@/components/dashboard/RecentActivity';
import GraphWidget from '@/components/dashboard/GraphWidget';
import MaintenanceRequestWidget from '@/components/dashboard/MaintenanceRequestWidget';

export default function Overview() {
  return (
    //   TODO: Excess card info makes the page scrollable to the right, still can't find a fix
    <div className="flex flex-col md:flex-row grow h-full max-w-full overflow-x-hidden">
      <div className="flex flex-col w-full md:w-4/5">
        <div className="flex flex-1 p-2">
          <GraphWidget />
        </div>
        <div className="flex flex-1 p-2">
          <MaintenanceRequestWidget />
        </div>
      </div>
      <div className="flex w-full md:w-1/5 p-2">
        <RecentActivity />
      </div>
    </div>
  );
}
