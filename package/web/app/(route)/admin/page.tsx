import { Wrapper } from '@/components/ui/wrapper';

import AdminComponent from './_component';
import { fetchUserList } from '@/data/user.action';
import { fetchAssetTypeList } from '@/data/asset-type.action';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';

export default async function AdminPage() {
  const userList = await fetchUserList();
  const assetTypeList = await fetchAssetTypeList();

  return (
    <Wrapper>
      <Suspense fallback={<Loader />}>
        <AdminComponent userList={userList} assetTypeList={assetTypeList} />
      </Suspense>
    </Wrapper>
  );
}
