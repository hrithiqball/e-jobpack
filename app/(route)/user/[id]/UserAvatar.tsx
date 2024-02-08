'use client';

import { User } from '@prisma/client';

import { Avatar } from '@nextui-org/react';

type UserAvatarProps = {
  user: User | null;
};

export default function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Avatar
        showFallback
        size="lg"
        src={user?.image ?? ''}
        name={user?.name}
        onClick={() => console.log(user?.image)}
      />
    </div>
  );
}
