'use client';

import { Key, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Tab, Tabs } from '@nextui-org/react';

import UserTab from './_user';
import ContractorTab from './_contractor';
import KpiTab from './_kpi';
import AssetTab from './_asset';
import { useUserStore } from '@/hooks/use-user.store';
import { useAssetTypeStore } from '@/hooks/use-asset-type.store';
import { AssetType } from '@/types/asset';
import { ContractorTypes, Contractors } from '@/types/contractor.type';
import { useContractorStore } from '@/hooks/use-contractor.store';
import { useContractorTypeStore } from '@/hooks/use-contractor-type-store';
import { useDepartmentTypeStore } from '@/hooks/use-department-type.store';
import { DepartmentTypes } from '@/types/department-enum';
import { Users } from '@/types/user';

type AdminComponentProps = {
  userList: Users;
  assetTypeList: AssetType[];
  contractors: Contractors;
  contractorTypes: ContractorTypes;
  departmentTypes: DepartmentTypes;
};

export default function AdminComponent({
  userList,
  assetTypeList,
  contractors,
  contractorTypes,
  departmentTypes,
}: AdminComponentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get('tab') ?? 'user';

  const { setUserList } = useUserStore();
  const { setAssetTypeList } = useAssetTypeStore();
  const { setContractors } = useContractorStore();
  const { setContractorTypes } = useContractorTypeStore();
  const { setDepartmentTypes } = useDepartmentTypeStore();

  useEffect(() => {
    setUserList(userList);
    setAssetTypeList(assetTypeList);
    setContractors(contractors);
    setContractorTypes(contractorTypes);
    setDepartmentTypes(departmentTypes);
  }, [
    userList,
    setUserList,
    assetTypeList,
    setAssetTypeList,
    contractors,
    setContractors,
    contractorTypes,
    setContractorTypes,
    departmentTypes,
    setDepartmentTypes,
  ]);

  function handleTabChange(key: Key) {
    router.push(`${pathname}?tab=${key}`);
  }

  return (
    <Tabs
      aria-label="admin-options"
      variant="underlined"
      color="primary"
      selectedKey={tab}
      onSelectionChange={handleTabChange}
    >
      <Tab key="user" title="User" className="flex flex-1 flex-col">
        <UserTab />
      </Tab>
      <Tab key="contractor" title="Contractor" className="flex flex-1 flex-col">
        <ContractorTab />
      </Tab>
      <Tab key="kpi" title="KPI" className="flex flex-1 flex-col">
        <KpiTab />
      </Tab>
      <Tab key="asset" title="Asset" className="flex flex-1 flex-col">
        <AssetTab />
      </Tab>
    </Tabs>
  );
}
