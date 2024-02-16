import { fetchUser } from '@/app/(route)/user/_actions/user';

import UserAvatar from './UserAvatar';

type UserItemPage = {
  params: { id: string };
};

export default async function UserItemPage({ params }: UserItemPage) {
  const { id } = params;

  const user = await fetchUser(id);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center justify-center">
        {user && <UserAvatar user={user} />}
      </div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
