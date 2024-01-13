import { fetchMaintenanceList } from '@/lib/actions/maintenance';
import TaskComponent from '@/components/client/task/TaskComponent';

export default async function TaskPage() {
  const maintenanceList = await fetchMaintenanceList();

  return (
    <div className="flex flex-1 flex-col h-full">
      <TaskComponent maintenanceList={maintenanceList} />
    </div>
  );
}
