import { User } from '@prisma/client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  UserRoundCheck,
  UserRoundPlus,
  UserRoundX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/hooks/use-user.store';
import { convertToTitleCase } from '@/lib/function/string';
import CreateUser from './create-user';
import ApproveUser from './approve-user';
import Image from 'next/image';
import { baseServerUrl } from '@/public/constant/url';
import UserPreview from './user-preview';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

export default function UserTab() {
  const router = useRouter();

  const { userList, setCurrentUser } = useUserStore();

  const unverifiedUsers =
    userList?.filter(user => user.emailVerified === null).length || 0;

  const [searchInput, setSearchInput] = useState('');
  const [openUserPreview, setOpenUserPreview] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openApproveUser, setOpenApproveUser] = useState(false);
  const [userData, setUserData] = useState(userList);

  useEffect(() => {
    setUserData(userList);
  }, [userList, setUserData]);

  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(event.target.value);
    setUserData(
      userList?.filter(user =>
        user.name.toLowerCase().includes(event.target.value.toLowerCase()),
      ),
    );
  }

  function handleOpenUserPreview(user: User) {
    setCurrentUser(user);
    setOpenUserPreview(true);
  }

  function handleOpenCreateUser() {
    setOpenCreateUser(true);
  }

  function handleOpenApproveUser() {
    setOpenApproveUser(true);
  }

  function handleCloseApproveUser() {
    setOpenApproveUser(false);
  }

  function handleCloseUserPreview() {
    setOpenUserPreview(false);
  }

  function handleCloseCreateUser() {
    setOpenCreateUser(false);
  }

  if (!userList || !userData) {
    router.push('/admin');
    return <Loader />;
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
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
        <div className="flex items-center space-x-4">
          {unverifiedUsers > 0 && (
            <Button
              variant="outline"
              size="withIcon"
              onClick={handleOpenApproveUser}
            >
              <UserRoundCheck size={18} />
              <p className="text-red-500">Approve User ({unverifiedUsers})</p>
            </Button>
          )}
          <Button
            variant="outline"
            size="withIcon"
            onClick={handleOpenCreateUser}
          >
            <UserRoundPlus size={18} />
            <p>Create User</p>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {userData.map(user => (
          <div
            key={user.id}
            className="flex cursor-pointer flex-col space-y-4 rounded-md bg-white p-4 dark:bg-card"
            onClick={() => handleOpenUserPreview(user)}
          >
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
            <div className="grid grid-cols-2 divide-x divide-tremor-border border-t border-tremor-border dark:divide-dark-tremor-border dark:border-dark-tremor-border">
              <div className="truncate px-3 py-2">
                <p className="text-xs text-gray-400">Department</p>
                <p className="text-medium">
                  {convertToTitleCase(user.department)}
                </p>
              </div>
              <div className="truncate px-3 py-2">
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-medium">{convertToTitleCase(user.role)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {userData.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <UserRoundX />
            <p>No user found</p>
          </div>
        </div>
      )}
      <UserPreview open={openUserPreview} onClose={handleCloseUserPreview} />
      <CreateUser open={openCreateUser} onClose={handleCloseCreateUser} />
      <ApproveUser open={openApproveUser} onClose={handleCloseApproveUser} />
    </div>
  );
}
