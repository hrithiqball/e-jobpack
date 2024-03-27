import { fetchUser } from '@/data/user.action';
import UserAvatar from './user-avatar';
import UserDetails from './user-component';
import { Loader } from '@/components/ui/loader';
import { getDepartmentTypes } from '@/data/department-type.action';

type UserItemPage = {
  params: { id: string };
};

export default async function UserItemPage({ params }: UserItemPage) {
  const { id } = params;

  const user = await fetchUser(id);
  const departments = await getDepartmentTypes();

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center justify-center p-4">
        <UserAvatar user={user} />
      </div>
      <div className="flex flex-col">
        <UserDetails userData={user} departments={departments} />
      </div>
    </div>
  );
}
