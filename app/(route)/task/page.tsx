import { fetchMaintenanceList } from '@/app/api/server-actions';
import Task from '@/components/client/task/Task';

export default async function TaskPage() {
  const maintenanceList = await fetchMaintenanceList();

  return (
    <div className="flex flex-col h-full">
      <Task maintenanceList={maintenanceList} />
    </div>
  );
}
