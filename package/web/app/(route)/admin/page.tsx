import { Wrapper } from '@/components/ui/wrapper';

import AdminComponent from './_component';
import { fetchUserList } from '@/lib/actions/user';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';

export default async function AdminPage() {
  const userList = await fetchUserList();
  const assetTypeList = await fetchAssetTypeList();

  return (
    <Wrapper>
      <AdminComponent userList={userList} assetTypeList={assetTypeList} />
    </Wrapper>
  );
}
