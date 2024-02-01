import { useState } from 'react';

import { Button, Input } from '@nextui-org/react';
import { FilePlus, Filter, Search } from 'lucide-react';

import { MaintenanceList } from '@/types/maintenance';
import { useMediaQuery } from '@/hooks/use-media-query';

type MaintenanceAllTabProps = {
  maintenanceList: MaintenanceList;
};

export default function MaintenanceAllTab({
  maintenanceList,
}: MaintenanceAllTabProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            size="sm"
            variant="faded"
            placeholder="Search"
            value={searchInput}
            onValueChange={setSearchInput}
            startContent={<Search size={18} />}
          />
          {/* <Button isIconOnly size="sm" variant="faded">
            <Filter size={18} />
          </Button> */}
          <div></div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="faded" startContent={<Filter size={18} />}>
            Filter
          </Button>
          <Button
            isIconOnly={!isDesktop}
            variant="faded"
            startContent={isDesktop ? <FilePlus size={18} /> : null}
          >
            {isDesktop ? (
              `Create Maintenance ${maintenanceList.length}`
            ) : (
              <FilePlus size={18} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
