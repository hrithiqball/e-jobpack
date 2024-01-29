'use client';

import { Key } from 'react';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import { Tab, Tabs } from '@nextui-org/react';

import { MaintenanceList, MaintenanceLibraryList } from '@/types/maintenance';
import MaintenanceAllTab from '@/app/(route)/maintenance/MaintenanceAllTab';
import MaintenanceLibraryTab from '@/app/(route)/maintenance/MaintenanceLibraryTab';

interface MaintenanceLibraryComponentProps {
  maintenanceList: MaintenanceList;
  maintenanceLibraryList: MaintenanceLibraryList;
}

export default function MaintenanceLibraryComponent({
  maintenanceList,
  maintenanceLibraryList,
}: MaintenanceLibraryComponentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get('tab') ?? 'all';

  function handleTabChange(key: Key) {
    router.push(
      `${pathname}?tab=${key}${key === 'library' ? '&create=false' : ''}`,
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Tabs
        aria-label="Maintenance options"
        variant="underlined"
        color="primary"
        selectedKey={tab}
        onSelectionChange={handleTabChange}
      >
        <Tab key="all" title="Maintenance" className="flex flex-col flex-1">
          <MaintenanceAllTab maintenanceList={maintenanceList} />
        </Tab>
        <Tab key="library" title="Library" className="flex flex-col flex-1">
          <MaintenanceLibraryTab
            maintenanceLibraryList={maintenanceLibraryList}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
