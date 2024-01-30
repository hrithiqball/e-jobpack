import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Button, ButtonGroup, Input } from '@nextui-org/react';
import { Check, LibraryBig, Search, X } from 'lucide-react';

import {
  MaintenanceLibraryList,
  MaintenanceLibraryItem,
} from '@/types/maintenance';
import { cn } from '@/lib/utils';
import MaintenanceLibraryTable from '@/components/maintenance/MaintenanceLibraryTable';
import MaintenanceLibraryCreate from '@/components/maintenance/MaintenanceLibraryCreate';
import MaintenanceLibraryEdit from '@/components/maintenance/MaintenanceLibraryEdit';
import { TaskLibraryList } from '@/types/task';

interface MaintenanceLibraryTabProps {
  maintenanceLibraryList: MaintenanceLibraryList;
  taskLibraryList: TaskLibraryList;
}

export default function MaintenanceLibraryTab({
  maintenanceLibraryList,
  taskLibraryList,
}: MaintenanceLibraryTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const isCreate = searchParams.get('create') === 'true';
  const isEdit = searchParams.get('isEdit') === 'true';
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

  function handleExitEditRoute() {
    router.push(`${pathName}?tab=library&isCreate=false`);
  }

  function handleSaveChanges() {
    router.push(`${pathName}?tab=library&isCreate=false`);
  }

  return isEdit && currentMaintenanceLibrary ? (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">
          {currentMaintenanceLibrary.title}
        </span>
        <ButtonGroup>
          <Button
            variant="faded"
            size="sm"
            color="danger"
            onClick={handleExitEditRoute}
            startContent={<X size={18} />}
          >
            Discard Changes
          </Button>
          <Button
            variant="faded"
            size="sm"
            color="primary"
            onClick={handleSaveChanges}
            startContent={<Check size={18} />}
          >
            Save Changes
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-1 flex-col">
        <MaintenanceLibraryEdit
          maintenanceLibrary={currentMaintenanceLibrary}
          taskLibraryList={taskLibraryList}
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
              Create Library
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
          <MaintenanceLibraryCreate />
        ) : (
          <MaintenanceLibraryTable
            maintenanceLibraryList={maintenanceLibraryList}
          />
        )}
      </div>
    </div>
  );
}
