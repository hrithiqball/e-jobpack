'use client';

import { Key } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { User } from '@prisma/client';

import { Tab, Tabs } from '@nextui-org/react';

import UserTab from './_user';
import ContractorTab from './_contractor';
import KpiTab from './_kpi';

type AdminComponentProps = {
  userList: User[];
};

export default function AdminComponent({ userList }: AdminComponentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get('tab') ?? 'user';

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
        <UserTab userList={userList} />
      </Tab>
      <Tab key="contractor" title="Contractor" className="flex flex-1 flex-col">
        <ContractorTab />
      </Tab>
      <Tab key="kpi" title="KPI" className="flex flex-1 flex-col">
        <KpiTab />
      </Tab>
    </Tabs>
  );
}
