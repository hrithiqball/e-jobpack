import { useChecklistLibStore } from '@/hooks/use-checklist-lib.store';

export default function AssetChecklist() {
  const checklistLibraryList =
    useChecklistLibStore.getState().checklistLibraryList;

  return (
    <div className="flex flex-1 flex-col p-4">
      should render list of checklist num: {checklistLibraryList.length}
      {checklistLibraryList.map(checklist => (
        <span key={checklist.id}>
          {checklist.title}
          <br />
        </span>
      ))}
    </div>
  );
}
