import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Button, Input } from '@nextui-org/react';
import { LibraryBig, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  MaintenanceLibraryList,
  MaintenanceLibraryItem,
} from '@/types/maintenance';
import { TaskLibraryList } from '@/types/task';

import MaintenanceLibraryCreate from './_maintenance-library-create';
import MaintenanceLibraryTable from './_maintenance-library-table';
import MaintenanceLibraryEdit from './_maintenance-library-edit';

type MaintenanceLibraryTabProps = {
  maintenanceLibraryList: MaintenanceLibraryList;
  taskLibraryList: TaskLibraryList;
};

export default function MaintenanceLibraryTab({
  maintenanceLibraryList,
  taskLibraryList,
}: MaintenanceLibraryTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

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

  const [searchInput, setSearchInput] = useState('');

  function handleCreateLibraryRoute() {
    router.push(`${pathName}?tab=library&create=${!isCreate}`);
  }

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
      {!isCreate && maintenanceLibraryList.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Input
              size="sm"
              variant="faded"
              color="primary"
              placeholder="Search"
              value={searchInput}
              onValueChange={setSearchInput}
              startContent={<Search size={18} />}
            />
            <div></div>
          </div>
          <div className="flex items-center">
            <Button
              variant="faded"
              color="primary"
              onClick={handleCreateLibraryRoute}
              startContent={<LibraryBig size={18} />}
            >
              Create
            </Button>
          </div>
        </div>
      )}
      <div
        className={cn('flex flex-1 flex-col', {
          'py-4': maintenanceLibraryList.length > 0,
        })}
      >
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
