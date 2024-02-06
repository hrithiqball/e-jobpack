import { Button } from '@nextui-org/react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from '@/components/ui/sheet';

import { useMediaQuery } from '@/hooks/use-media-query';
import { MaintenanceList } from '@/types/maintenance';

type MaintenanceRecreateProps = {
  open: boolean;
  onClose: () => void;
  maintenanceList: MaintenanceList;
};

export default function MaintenanceRecreate({
  open,
  onClose,
  maintenanceList,
}: MaintenanceRecreateProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop ? (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>Recreate Maintenance</SheetHeader>
        <div className="my-4">
          {maintenanceList.map(maintenance => (
            <div key={maintenance.id}>{maintenance.id}</div>
          ))}
        </div>
        <SheetFooter>
          <Button variant="faded" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="faded" size="sm" color="primary">
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>Recreate Maintenance</DrawerHeader>
        Mobile coming soon
        <DrawerFooter>
          <Button onClick={onClose}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
