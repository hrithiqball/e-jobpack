import {
  Drawer,
  DrawerContent,
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
import { Button } from '@/components/ui/button';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useUserStore } from '@/hooks/use-user.store';

type UserPreviewProps = {
  open: boolean;
  onClose: () => void;
};

export default function UserPreview({ open, onClose }: UserPreviewProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { currentUser } = useUserStore();

  function handleClose() {
    onClose();
  }

  if (!currentUser) return null;

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Preview</SheetTitle>
        </SheetHeader>
        <SheetFooter>
          <Button>Hello</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerHeader>
            <DrawerTitle>Preview</DrawerTitle>
          </DrawerHeader>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
