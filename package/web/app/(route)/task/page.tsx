import { fetchMaintenanceList } from '@/data/maintenance.action';

import TaskComponent from './_component';

export default async function TaskPage() {
  const maintenanceList = await fetchMaintenanceList();

  return (
    <div className="flex h-full flex-1 flex-col">
      <TaskComponent maintenanceList={maintenanceList} />
    </div>
  );
}
