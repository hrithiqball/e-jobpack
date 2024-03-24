import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Table, TableCell, TableRow } from '@/components/ui/table';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useUserStore } from '@/hooks/use-user.store';
import { adminApproveUser, adminRejectUser } from '@/data/user.action';
import { convertToTitleCase } from '@/lib/function/string';
import { User } from '@prisma/client';
import { Check, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

type ApproveUserProps = {
  open: boolean;
  onClose: () => void;
};

export default function ApproveUser({ open, onClose }: ApproveUserProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { userList } = useUserStore();

  const [unverifiedUsers, setUnverifiedUsers] = useState(
    userList?.filter(user => user.emailVerified === null),
  );

  function handleApprove(user: User) {
    console.log('Approve');
    setUnverifiedUsers(unverifiedUsers?.filter(u => u.id !== user.id));
    startTransition(() => {
      toast.promise(adminApproveUser(user.id), {
        loading: 'Approving user...',
        success: `User ${user.name} approved`,
        error: 'Failed to approve user',
      });
    });
  }

  function handleReject(user: User) {
    console.log('Reject');
    startTransition(() => {
      toast.promise(adminRejectUser(user.id), {
        loading: 'Rejecting user...',
        success: `User ${user.name} rejected`,
        error: 'Failed to reject user',
      });
    });
    setUnverifiedUsers(unverifiedUsers?.filter(u => u.id !== user.id));
  }

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Approve User</SheetTitle>
        </SheetHeader>
        <Table>
          {unverifiedUsers?.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-col">
                  <p>{user.name}</p>
                  <p className="text-xs">
                    {convertToTitleCase(user.role)} |{' '}
                    {convertToTitleCase(user.department)}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    size="icon"
                    disabled={transitioning}
                    onClick={() => handleApprove(user)}
                  >
                    <Check />
                  </Button>
                  <Button
                    size="icon"
                    disabled={transitioning}
                    onClick={() => handleReject(user)}
                  >
                    <X />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Approve User</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
