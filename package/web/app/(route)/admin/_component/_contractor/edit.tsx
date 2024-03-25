import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useContractorStore } from '@/hooks/use-contractor.store';
import { useMediaQuery } from '@/hooks/use-media-query';

type EditContractorProps = {
  open: boolean;
  onClose: () => void;
};

export default function EditContractor({ open, onClose }: EditContractorProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { contractor } = useContractorStore();

  function handleClose() {
    onClose();
  }

  if (!contractor) {
    onClose();
    return;
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{contractor.name}</SheetTitle>
        </SheetHeader>
        <SheetFooter>
          <Button variant="outline">Register</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Register Contractor</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="outline">Register</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
