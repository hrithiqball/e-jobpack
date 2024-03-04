import { Maintenance } from '@/types/maintenance';

import TaskMaintenanceChecklist from './_task-checklist';
import TaskTable from './TaskTable';

type MaintenanceChecklistProps = {
  checklist: Maintenance['checklist'][0];
};

export default function MaintenanceChecklist({
  checklist,
}: MaintenanceChecklistProps) {
  return (
    <TaskMaintenanceChecklist checklist={checklist} checklistLibraryList={[]}>
      <TaskTable taskList={checklist.task} />
    </TaskMaintenanceChecklist>
  );
}
