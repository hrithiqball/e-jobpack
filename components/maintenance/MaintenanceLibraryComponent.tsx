'use client';

import { Key } from 'react';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import { Tab, Tabs } from '@nextui-org/react';

import { MaintenanceList, MaintenanceLibraryList } from '@/types/maintenance';
import { ChecklistLibraryList } from '@/types/checklist';
import { TaskLibraryList } from '@/types/task';
import MaintenanceAllTab from '@/components/maintenance/MaintenanceAllTab';
import MaintenanceLibraryTab from '@/components/maintenance/MaintenanceLibraryTab';
import MaintenanceChecklistTab from '@/components/maintenance/MaintenanceChecklistTab';

type MaintenanceLibraryComponentProps = {
  maintenanceList: MaintenanceList;
  maintenanceLibraryList: MaintenanceLibraryList;
  taskLibraryList: TaskLibraryList;
  checklistLibrary: ChecklistLibraryList;
};

export default function MaintenanceLibraryComponent({
  maintenanceList,
  maintenanceLibraryList,
  taskLibraryList,
  checklistLibrary,
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
        <Tab key="all" title="Maintenance" className="flex flex-1 flex-col">
          <MaintenanceAllTab maintenanceList={maintenanceList} />
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
