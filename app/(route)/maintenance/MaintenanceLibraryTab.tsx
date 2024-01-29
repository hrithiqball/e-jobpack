import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Button, Input } from '@nextui-org/react';
import { LibraryBig, Search } from 'lucide-react';

import { MaintenanceLibraryList } from '@/types/maintenance';
import MaintenanceLibraryTable from '@/app/(route)/maintenance/MaintenanceLibraryTable';
import MaintenanceLibraryCreate from '@/app/(route)/maintenance/MaintenanceLibraryCreate';
import { cn } from '@/lib/utils';

interface MaintenanceLibraryTabProps {
  maintenanceLibraryList: MaintenanceLibraryList;
}

export default function MaintenanceLibraryTab({
  maintenanceLibraryList,
}: MaintenanceLibraryTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const isCreate = searchParams.get('create') === 'true';

  const [searchInput, setSearchInput] = useState('');

  function handleCreateLibraryRoute() {
    router.push(`${pathName}?tab=library&create=${!isCreate}`);
  }

  return (
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
