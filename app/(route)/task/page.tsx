import { fetchMaintenanceList } from '@/app/api/server-actions';
import Task from '@/components/client/task/Task';
import Navigation from '@/components/client/Navigation';

export default async function TaskPage() {
  const maintenanceList = await fetchMaintenanceList();

  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <Task maintenanceList={maintenanceList} />
    </div>
  );
}
