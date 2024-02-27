import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useChecklistLibStore } from '@/hooks/use-checklist-lib.store';

type ChecklistLibraryDetailsProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChecklistLibraryDetails({
  open,
  onClose,
}: ChecklistLibraryDetailsProps) {
  const { currentChecklistLibrary } = useChecklistLibStore();

  function handleClose() {
    onClose();
  }

  return (
    currentChecklistLibrary && (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{currentChecklistLibrary.title} Details</SheetTitle>
          </SheetHeader>
          hello
        </SheetContent>
      </Sheet>
    )
  );
}
