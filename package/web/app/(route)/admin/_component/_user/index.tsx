import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Search,
  UserRoundCheck,
  UserRoundPlus,
  UserRoundX,
  UserX2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/hooks/use-user.store';
import CreateUser from './create-user';
import UserPreview from './user-preview';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import General from './general';
import Verify from './verify';
import Block from './block';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverItemDestructive,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User } from '@/types/user';

type Section = 'general' | 'approve' | 'block';

export default function UserTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { userList, setCurrentUser } = useUserStore();

  const section = searchParams.get('section') ?? 'general';

  const unverifiedUsers =
    userList?.filter(user => !user.emailVerified).length || 0;

  const [searchInput, setSearchInput] = useState('');
  const [openUserPreview, setOpenUserPreview] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [userData, setUserData] = useState(userList);

  useEffect(() => {
    setUserData(userList);
  }, [userList, setUserData]);

  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (section) {
      case 'general':
        setSearchInput(event.target.value);
        setUserData(
          userList?.filter(user =>
            user.name.toLowerCase().includes(event.target.value.toLowerCase()),
          ),
        );
        break;
    }
  }

  function handleOpenUserPreview(user: User) {
    setCurrentUser(user);
    setOpenUserPreview(true);
  }

  function handleOpenCreateUser() {
    setOpenCreateUser(true);
  }

  function handleSectionChange(section: Section) {
    setSearchInput('');
    router.push(`${pathname}?tab=user&section=${section}`);
  }

  function handleCloseUserPreview() {
    setOpenUserPreview(false);
  }

  function handleCloseCreateUser() {
    setOpenCreateUser(false);
  }

  if (!userList || !userData) {
    router.push('/admin');

    return (
      <>
        <p>jui</p>
        <Loader />;
      </>
    );
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 rounded-md p-2">
            <PopoverItem
              startContent={<UserRoundPlus size={18} />}
              onClick={handleOpenCreateUser}
            >
              Create User
            </PopoverItem>
            <div className="relative">
              <PopoverItem
                startContent={<UserRoundCheck size={18} />}
                onClick={() => handleSectionChange('approve')}
              >
                Approve User
              </PopoverItem>
              {unverifiedUsers > 0 && (
                <div className="absolute left-0 top-0 size-2 animate-ping rounded-full bg-red-500"></div>
              )}
            </div>
            <PopoverItemDestructive
              startContent={<UserX2 size={18} />}
              onClick={() => handleSectionChange('block')}
            >
              Block User
            </PopoverItemDestructive>
          </PopoverContent>
        </Popover>
      </div>
      {section === 'general' && (
        <General
          userData={userData}
          handleOpenUserPreview={handleOpenUserPreview}
        />
      )}
      {section === 'approve' && (
        <Verify
          handleOpenUserPreview={handleOpenUserPreview}
          unverifiedUsers={userList.filter(user => !user.emailVerified)}
        />
      )}
      {section === 'block' && <Block />}
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
    </div>
  );
}
