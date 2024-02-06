import dynamic from 'next/dynamic';

import { fetchTaskList } from '@/lib/actions/task';
import { MutatedMaintenance } from '@/types/maintenance';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';

import TaskMaintenanceChecklist from '@/app/(route)/task/[id]/_maintenance-component/_checklist-component/_maintenance-checklist/_task-checklist';

const TaskTable = dynamic(
  () =>
    import(
      '@/app/(route)/task/[id]/_maintenance-component/_checklist-component/TaskTable'
    ),
  {
    ssr: false,
  },
);

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
