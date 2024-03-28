import { Wrapper } from '@/components/ui/wrapper';

import AdminComponent from './_component';
import { fetchUserList } from '@/data/user.action';
import { fetchAssetTypeList } from '@/data/asset-type.action';
import { Suspense } from 'react';
import { Loader } from '@/components/ui/loader';
import { getContractors } from '@/data/contractor.action';
import { getContactorTypes } from '@/data/contractor-type.action';
import { getDepartmentTypes } from '@/data/department-type.action';

export default async function AdminPage() {
  const userList = await fetchUserList();
  const assetTypeList = await fetchAssetTypeList();
  const contractors = await getContractors();
  const contractorTypes = await getContactorTypes();
  const departmentTypes = await getDepartmentTypes();

  return (
    <Wrapper>
      <Suspense fallback={<Loader />}>
        <AdminComponent
          userList={userList}
          assetTypeList={assetTypeList}
          contractors={contractors}
          contractorTypes={contractorTypes}
          departmentTypes={departmentTypes}
        />
      </Suspense>
    </Wrapper>
  );
}
