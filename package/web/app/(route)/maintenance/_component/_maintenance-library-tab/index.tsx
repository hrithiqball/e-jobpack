import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

import {
  MaintenanceLibraryList,
  MaintenanceLibraryItem,
} from '@/types/maintenance';
import { TaskLibraryList } from '@/types/task';

import MaintenanceLibraryCreate from './_create';
import MaintenanceLibraryTable from './_table';
import MaintenanceLibraryEdit from './_edit';

type MaintenanceLibraryTabProps = {
  maintenanceLibraryList: MaintenanceLibraryList;
  taskLibraryList: TaskLibraryList;
};

export default function MaintenanceLibraryTab({
  maintenanceLibraryList,
  taskLibraryList,
}: MaintenanceLibraryTabProps) {
  const searchParams = useSearchParams();

  const isCreate = searchParams.get('create') === 'true' || false;
  const isEdit = searchParams.get('isEdit') === 'true' || false;
  const libraryId = searchParams.get('libraryId');

  const [currentMaintenanceLibrary, setCurrentMaintenanceLibrary] =
    useState<null | MaintenanceLibraryItem>(null);

  useEffect(() => {
    const library = maintenanceLibraryList.find(
      maintenance => maintenance.id === libraryId,
    );

    if (library) setCurrentMaintenanceLibrary(library);
  }, [libraryId, maintenanceLibraryList]);

  return isEdit && currentMaintenanceLibrary ? (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold">
          {currentMaintenanceLibrary.title}
        </span>
      </div>
      <div className="flex flex-1 flex-col">
        <MaintenanceLibraryEdit
          maintenanceLibrary={currentMaintenanceLibrary}
          taskLibraryList={taskLibraryList.filter(
            task => !task.checklistLibraryId,
          )}
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-1 flex-col">
      <div className={cn('flex flex-1 flex-col')}>
        {isCreate ? (
          <MaintenanceLibraryCreate
            maintenanceLibraryList={maintenanceLibraryList}
            taskLibraryList={taskLibraryList}
          />
        ) : (
          <MaintenanceLibraryTable
            maintenanceLibraryList={maintenanceLibraryList}
          />
        )}
      </div>
    </div>
  );
}
