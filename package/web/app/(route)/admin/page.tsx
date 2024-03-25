import { Wrapper } from '@/components/ui/wrapper';

import AdminComponent from './_component';
import { fetchUserList } from '@/data/user.action';
import { fetchAssetTypeList } from '@/data/asset-type.action';
import { Suspense } from 'react';
import { Loader } from '@/components/ui/loader';
import { getContractors } from '@/data/contractor.action';

export default async function AdminPage() {
  const userList = await fetchUserList();
  const assetTypeList = await fetchAssetTypeList();
  const contractors = await getContractors();

  return (
    <Wrapper>
      <Suspense fallback={<Loader />}>
        <AdminComponent
          userList={userList}
          assetTypeList={assetTypeList}
          contractors={contractors}
        />
      </Suspense>
    </Wrapper>
  );
}
