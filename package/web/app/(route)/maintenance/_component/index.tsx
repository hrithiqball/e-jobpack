'use client';

import { Key, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import { Tab, Tabs } from '@nextui-org/react';

import { useAssetStore } from '@/hooks/use-asset.store';
import { useUserStore } from '@/hooks/use-user.store';
import { MaintenanceList, MaintenanceLibraryList } from '@/types/maintenance';
import { ChecklistLibraryList } from '@/types/checklist';
import { TaskLibraryList } from '@/types/task';
import { AssetList } from '@/types/asset';

import MaintenanceTab from './_maintenance-tab';
import MaintenanceLibraryTab from './_maintenance-library-tab';
import MaintenanceChecklistTab from './_checklist-library-tab';
import { Users } from '@/types/user';

type MaintenanceLibraryComponentProps = {
  maintenanceList: MaintenanceList;
  maintenanceLibraryList: MaintenanceLibraryList;
  taskLibraryList: TaskLibraryList;
  checklistLibrary: ChecklistLibraryList;
  userList: Users;
  assetList: AssetList;
};

export default function MaintenanceComponent({
  maintenanceList,
  maintenanceLibraryList,
  taskLibraryList,
  checklistLibrary,
  userList,
  assetList,
}: MaintenanceLibraryComponentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { setAssetList } = useAssetStore();
  const { setUserList } = useUserStore();

  useEffect(() => {
    setAssetList(assetList);
    setUserList(userList);
  }, [assetList, userList, setAssetList, setUserList]);

  const tab = searchParams.get('tab') ?? 'maintenance';

  function handleTabChange(key: Key) {
    switch (key) {
      case 'library':
        router.push(`${pathname}?tab=library&create=false`);
        break;

      case 'checklist':
        router.push(`${pathname}?tab=checklist`);
        break;

      case 'maintenance':
        router.push(`${pathname}?tab=maintenance`);
        break;
    }
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
        <Tab
          key="maintenance"
          title="Maintenance"
          className="flex flex-1 flex-col"
        >
          <MaintenanceTab maintenanceList={maintenanceList} />
        </Tab>
        <Tab
          key="library"
          title="Maintenance Library"
          className="flex flex-1 flex-col"
        >
          <MaintenanceLibraryTab
            maintenanceLibraryList={maintenanceLibraryList}
            taskLibraryList={taskLibraryList}
          />
        </Tab>
        <Tab
          key="checklist"
          title="Checklist Library"
          className="flex flex-1 flex-col"
        >
          <MaintenanceChecklistTab checklistLibraryList={checklistLibrary} />
        </Tab>
      </Tabs>
    </div>
  );
}
