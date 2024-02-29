import RecentActivity from './recent-activity';
import GraphWidget from './analytical';
import MaintenanceRequestWidget from './maintenance-request';

export default function Overview() {
  return (
    <div className="flex h-full max-w-full grow flex-col overflow-x-hidden md:flex-row">
      <div className="flex w-full flex-col md:w-4/5">
        <div className="flex flex-1 p-2">
          <GraphWidget />
        </div>
        <div className="flex flex-1 p-2">
          <MaintenanceRequestWidget />
        </div>
      </div>
      <div className="flex w-full p-2 md:w-1/5">
        <RecentActivity />
      </div>
    </div>
  );
}
