import Task from '@/components/client/task/Task';
import { fetchMaintenanceList } from '@/lib/actions/maintenance';

export default async function TaskPage() {
  const maintenanceList = await fetchMaintenanceList();

  return (
    <div className="flex flex-col h-full">
      <Task maintenanceList={maintenanceList} />
    </div>
  );
}
