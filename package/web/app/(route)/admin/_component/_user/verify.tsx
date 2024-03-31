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
import { Loader } from '@/components/ui/loader';
import { adminApproveUser, adminRejectUser } from '@/data/user.action';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserStore } from '@/hooks/use-user.store';
import { convertToTitleCase } from '@/lib/function/string';
import { baseServerUrl } from '@/public/constant/url';
import { User } from '@/types/user';
import { ChevronLeft, Edit, Search, UserX2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import UserPreview from './user-preview';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function Verify() {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();

  const { userList, setCurrentUser } = useUserStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [userData, setUserData] = useState(
    userList?.filter(user => !user.emailVerified),
  );

  function handleApprove(approvedUser: User) {
    startTransition(() => {
      if (!user || !user.id || !approvedUser) {
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
      if (!user || !user.id || !rejectedUser) {
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

  function handleOpenUserPreview(user: User) {
    setCurrentUser(user);
    setOpenPreview(true);
  }

  function handleCloseUserPreview() {
    setOpenPreview(false);
  }

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    const filteredUserList = userList?.filter(user =>
      user.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );

    setUserData(filteredUserList);
  }

  function handleOpenDialog() {
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  if (!userData) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center">
        <Link href="/admin">
          <Button variant="outline" size="withIcon">
            <ChevronLeft size={18} />
            <p>Back</p>
          </Button>
        </Link>
        {userData.length > 0 && (
          <div className="flex items-center">
            <Search
              size={18}
              className="relative left-7 top-2 -translate-y-1/2"
            />
            <Input
              placeholder="Search"
              type="search"
              aria-label="Search user list"
              value={searchInput}
              onChange={handleSearchInputChange}
              className="max-w-sm pl-8"
            />
          </div>
        )}
      </div>
      {userData.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <UserX2 />
            <p>No user to be verify right now</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {userData.map(user => (
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
                    className="size-12 rounded-full object-contain"
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
                <p className="text-sm">{user.departmentId}</p>
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
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
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
      <UserPreview open={openPreview} onClose={handleCloseUserPreview} />
    </div>
  );
}
