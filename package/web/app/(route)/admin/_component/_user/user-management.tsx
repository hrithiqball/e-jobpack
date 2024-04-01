import Image from 'next/image';
import { baseServerUrl } from '@/public/constant/url';
import { convertToTitleCase } from '@/lib/function/string';
import { User } from '@/types/user';
import { ChevronLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import UserPreview from './user-preview';
import { useUserStore } from '@/hooks/use-user.store';
import { Loader } from '@/components/ui/loader';

export default function General() {
  const { userList, setCurrentUser } = useUserStore();

  const [searchInput, setSearchInput] = useState('');
  const [userData, setUserData] = useState(userList);
  const [openPreview, setOpenPreview] = useState(false);

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    const filteredUserList = userData?.filter(user =>
      user.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );

    setUserData(filteredUserList);
  }

  function handleOpenUserPreview(user: User) {
    setCurrentUser(user);
    setOpenPreview(true);
  }

  function handleClosePreview() {
    setOpenPreview(false);
  }

  if (!userData) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center">
        <Link href="/admin">
          <Button variant="outline" size="withIcon">
            <ChevronLeft size={18} />
            <p>Back</p>
          </Button>
        </Link>
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
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
                  className="size-12 rounded-full bg-teal-100 object-contain"
                />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-full bg-teal-800">
                  <p className="text-medium text-white">
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
                <p className="text-medium">{user.department?.value}</p>
              </div>
              <div className="truncate px-3 py-2">
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-medium">{convertToTitleCase(user.role)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <UserPreview open={openPreview} onClose={handleClosePreview} />
    </div>
  );
}
