import RecentActivity from './recent-activity';
import GraphWidget from './analytical';
import MaintenanceRequestWidget from './maintenance-request';

export default function Overview() {
  return (
    <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-5">
      <div className="flex h-full flex-col md:col-span-3 lg:col-span-4">
        <div className="flex-grow rounded-lg bg-white p-4 dark:bg-card">
          <GraphWidget />
        </div>
        <div className="mt-4 flex-grow rounded-lg bg-white p-4 dark:bg-card">
          <MaintenanceRequestWidget />
        </div>
      </div>
      <div className="flex h-full flex-col lg:col-span-1">
        <div className="flex-grow rounded-lg bg-white p-4 dark:bg-card">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
