import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

type MaintenanceAddAttachmentProps = {
  open: boolean;
  onClose: () => void;
};
export default function MaintenanceAddAttachment({
  open,
  onClose,
}: MaintenanceAddAttachmentProps) {
  function handleClose() {
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Maintenance Attachment</SheetTitle>
          hello
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
