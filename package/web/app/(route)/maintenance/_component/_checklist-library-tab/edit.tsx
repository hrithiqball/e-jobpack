import { useChecklistLibStore } from '@/hooks/use-checklist-lib.store';

export default function ChecklistLibraryEdit() {
  const { currentChecklistLibrary } = useChecklistLibStore();

  return (
    currentChecklistLibrary && (
      <div>ChecklistLibraryEdit {currentChecklistLibrary.id}</div>
    )
  );
}
