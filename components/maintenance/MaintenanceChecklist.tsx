import dynamic from 'next/dynamic';

import TaskMaintenanceChecklist from '@/components/checklist/ChecklistItemComponent';
import { fetchTaskList } from '@/lib/actions/task';
import { MutatedMaintenance } from '@/types/maintenance';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';

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
  const checklistLibraryList = await fetchChecklistLibraryList(
    checklist.assetId,
  );

  return (
    <TaskMaintenanceChecklist
      checklist={checklist}
      checklistLibraryList={checklistLibraryList}
    >
      <TaskTable taskList={taskList} />
    </TaskMaintenanceChecklist>
  );
}
