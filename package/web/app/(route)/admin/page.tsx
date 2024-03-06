import { Wrapper } from '@/components/ui/wrapper';

import AdminComponent from './_component';
import { fetchUserList } from '@/lib/actions/user';

export default async function AdminPage() {
  const userList = await fetchUserList();

  return (
    <Wrapper>
      <AdminComponent userList={userList} />
    </Wrapper>
  );
}
