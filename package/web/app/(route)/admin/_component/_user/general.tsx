import Image from 'next/image';
import { baseServerUrl } from '@/public/constant/url';
import { convertToTitleCase } from '@/lib/function/string';
import { User, Users } from '@/types/user';

type UserGeneralProps = {
  userData: Users;
  handleOpenUserPreview: (user: User) => void;
};

export default function General({
  userData,
  handleOpenUserPreview,
}: UserGeneralProps) {
  return (
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
              <div className="flex size-12 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                <p className="text-medium text-white">
                  {user.name.substring(0, 1).toUpperCase()}
                </p>
              </div>
            )}
            <div className="flex flex-col">
              <div className="truncate">
                <p>{user.name}</p>
              </div>
              <div className="truncate text-sm text-gray-400">{user.email}</div>
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
  );
}
