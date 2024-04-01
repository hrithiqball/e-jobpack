import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';

type AddRecordProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddRecord({ open, onClose }: AddRecordProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Record</SheetTitle>
        </SheetHeader>
        <SheetFooter>
          <Button variant="outline">Add</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Record</SheetTitle>
        </SheetHeader>
        <SheetFooter>
          <Button variant="outline">Add</Button>
        </SheetFooter>
      </SheetContent>
    </Drawer>
  );
}
