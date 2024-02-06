import { fetchMaintenanceList } from '@/lib/actions/maintenance';
import TaskComponent from '@/app/(route)/task/TaskComponent';

export default async function TaskPage() {
  const maintenanceList = await fetchMaintenanceList();

  return (
    <div className="flex h-full flex-1 flex-col">
      <TaskComponent maintenanceList={maintenanceList} />
    </div>
  );
}
