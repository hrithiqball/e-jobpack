import { Maintenance } from '@/types/maintenance';

import MaintenanceChecklist from './_opened';
import ClosedChecklist from './_closed';

type ChecklistComponentProps = {
  checklistList: Maintenance['checklist'];
};

export default function ChecklistComponent({
  checklistList,
}: ChecklistComponentProps) {
  return (
    <div className="space-y-4">
      {checklistList.filter(checklist => checklist.isClose).length > 0 && (
        <ClosedChecklist
          checklistList={checklistList.filter(
            checklistList => checklistList.isClose,
          )}
        />
      )}
      {checklistList
        .filter(checklist => !checklist.isClose)
        .map(checklist => (
          <MaintenanceChecklist key={checklist.id} checklist={checklist} />
        ))}
    </div>
  );
}
