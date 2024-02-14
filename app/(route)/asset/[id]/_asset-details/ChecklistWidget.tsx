import { useChecklistLibStore } from '@/hooks/use-checklist-lib.store';
import { Card } from '@nextui-org/react';
import { FilePenLine } from 'lucide-react';

export default function ChecklistWidget() {
  const checklistLibraryList =
    useChecklistLibStore.getState().checklistLibraryList;

  return (
    <div className="flex flex-1 p-2">
      <Card
        shadow="none"
        className="flex flex-1 flex-col space-y-4 p-4 dark:bg-card"
      >
        <div className="flex flex-row items-center">
          <FilePenLine />
          <span className="ml-4 font-bold">Checklist</span>
        </div>
        <div className="flex flex-col">
          {checklistLibraryList.map(checklist => (
            <span key={checklist.id}>{checklist.title}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}
