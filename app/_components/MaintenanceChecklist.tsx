import dynamic from 'next/dynamic';

import TaskMaintenanceChecklist from '@/components/checklist/ChecklistItemComponent';
import { fetchTaskList } from '@/lib/actions/task';
import { MutatedMaintenance } from '@/types/maintenance';

const TaskTable = dynamic(() => import('@/components/task/TaskTable'), {
  ssr: false,
});

interface MaintenanceChecklistProps {
  checklist: MutatedMaintenance['checklist'][0];
}

export default async function MaintenanceChecklist({
  checklist,
}: MaintenanceChecklistProps) {
  const taskList = await fetchTaskList(checklist.id);

  return (
    <TaskMaintenanceChecklist checklist={checklist}>
      <TaskTable taskList={taskList} />
    </TaskMaintenanceChecklist>
  );
}
