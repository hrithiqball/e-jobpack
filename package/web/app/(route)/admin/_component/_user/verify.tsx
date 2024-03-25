import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { adminApproveUser, adminRejectUser } from '@/data/user.action';
import { useCurrentUser } from '@/hooks/use-current-user';
import { convertToTitleCase } from '@/lib/function/string';
import { baseServerUrl } from '@/public/constant/url';
import { User } from '@prisma/client';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

type UserPreviewProps = {
  unverifiedUsers: User[];
  handleOpenUserPreview: (user: User) => void;
};

export default function Verify({
  unverifiedUsers,
  handleOpenUserPreview,
}: UserPreviewProps) {
  const [transitioning, startTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState(false);

  const user = useCurrentUser();

  function handleApprove(approvedUser: User) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      toast.promise(adminApproveUser(approvedUser.id, user.id), {
        loading: 'Approving user...',
        success: res => {
          return `User ${res.name} approved`;
        },
        error: 'Failed to approve user',
      });
    });
  }

  function handleReject(rejectedUser: User) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      toast.promise(adminRejectUser(rejectedUser.id, user.id), {
        loading: 'Rejecting user...',
        success: res => {
          return `User ${res.name} rejected`;
        },
        error: 'Failed to reject user',
      });
    });
  }

  function handleOpenDialog() {
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {unverifiedUsers.map(user => (
        <div
          key={user.id}
          className="flex flex-col space-y-4 rounded-md bg-white p-4 dark:bg-card"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user.image ? (
                <Image
                  src={`${baseServerUrl}/user/${user.image}`}
                  alt={user.name}
                  height={48}
                  width={48}
                  className="size-12 rounded-full"
                />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                  <p className="text-medium">
                    {user.name.substring(0, 1).toUpperCase()}
                  </p>
                </div>
              )}
              <div className="flex flex-col">
                <div className="truncate">
                  <p>{user.name}</p>
                </div>
                <div className="truncate text-sm text-gray-400">
                  {user.email}
                </div>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleOpenUserPreview(user)}
            >
              <Edit />
            </Button>
          </div>
          <div className="grid grid-cols-2 divide-x divide-tremor-border border-t border-tremor-border dark:divide-dark-tremor-border dark:border-dark-tremor-border">
            <div className="truncate px-3 py-2">
              <p className="text-xs text-gray-400">Department</p>
              <p className="text-sm">{convertToTitleCase(user.department)}</p>
            </div>
            <div className="truncate px-3 py-2">
              <p className="text-xs text-gray-400">Role</p>
              <p className="text-sm">{convertToTitleCase(user.role)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleApprove(user)}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={handleOpenDialog}
              className="flex-1"
            >
              Reject
            </Button>
            <AlertDialog open={openDialog} onOpenChange={handleCloseDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Rejected user can still be approved later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={transitioning}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={transitioning}
                    onClick={() => handleReject(user)}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
