import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';

import { useMediaQuery } from '@/hooks/use-media-query';
import { MaintenanceLibraryItem } from '@/types/maintenance';

interface MaintenanceLibraryInfoProps {
  open: boolean;
  onClose: () => void;
  maintenanceLibrary: MaintenanceLibraryItem;
}

export default function MaintenanceLibraryInfo({
  open,
  onClose,
  maintenanceLibrary,
}: MaintenanceLibraryInfoProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop ? (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>{maintenanceLibrary.title}</SheetHeader>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>{maintenanceLibrary.title}</DrawerHeader>
        <DrawerFooter>
          <button onClick={onClose}>close</button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
