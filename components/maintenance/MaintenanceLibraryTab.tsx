import { useState } from 'react';

import { Input } from '@nextui-org/react';

import { MaintenanceLibraryList } from '@/types/maintenance';
import { Search } from 'lucide-react';

interface MaintenanceLibraryTabProps {
  maintenanceLibraryList: MaintenanceLibraryList;
}

export default function MaintenanceLibraryTab({
  maintenanceLibraryList,
}: MaintenanceLibraryTabProps) {
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="flex flex-1 flex-col">
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
          <div>{maintenanceLibraryList.length}</div>
        </div>
      </div>
    </div>
  );
}
