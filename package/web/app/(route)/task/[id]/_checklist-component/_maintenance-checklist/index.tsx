import dynamic from 'next/dynamic';

import { fetchTaskList } from '@/lib/actions/task';
import { Maintenance } from '@/types/maintenance';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';

import TaskMaintenanceChecklist from './_task-checklist';

const TaskTable = dynamic(() => import('./TaskTable'), { ssr: false });

interface MaintenanceChecklistProps {
  checklist: Maintenance['checklist'][0];
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
