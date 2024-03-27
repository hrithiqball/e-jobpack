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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';

type AddContractorTypeProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddContractorType({
  open,
  onClose,
}: AddContractorTypeProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Types</SheetTitle>
          <SheetDescription>
            Contractor types can be used for filtering and tagging purposes
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button variant="outline">Add</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Types</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="outline">Add</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
