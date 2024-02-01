import MaintenanceChecklist from '@/app/(route)/task/[id]/MaintenanceChecklist';
import ClosedChecklist from '@/components/checklist/ClosedChecklist';
import { MutatedMaintenance } from '@/types/maintenance';

type ChecklistComponentProps = {
  checklistList: MutatedMaintenance['checklist'];
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
