import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';

import { useMediaQuery } from '@/hooks/use-media-query';
import { MaintenanceLibraryItem } from '@/types/maintenance';
import { Button } from '@nextui-org/react';
import { Edit } from 'lucide-react';

interface MaintenanceLibraryInfoProps {
  maintenanceLibrary: MaintenanceLibraryItem;
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  handleEdit: (libraryId: string) => void;
}

export default function MaintenanceLibraryInfo({
  open,
  onClose,
  maintenanceLibrary,
  handleEdit,
}: MaintenanceLibraryInfoProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop ? (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <div className="flex justify-between">
            <span>{maintenanceLibrary.title}</span>
            <Button
              isIconOnly
              variant="faded"
              size="sm"
              color="primary"
              onClick={() => handleEdit(maintenanceLibrary.id)}
            >
              <Edit size={18} />
            </Button>
          </div>
        </SheetHeader>
        {/* <div className="flex flex-1 flex-col">
        </div> */}
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
