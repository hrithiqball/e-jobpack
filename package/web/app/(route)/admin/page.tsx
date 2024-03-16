import { Wrapper } from '@/components/ui/wrapper';

import AdminComponent from './_component';
import { fetchUserList } from '@/lib/actions/user';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';
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
