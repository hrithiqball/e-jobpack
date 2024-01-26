import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';

import { Maintenance } from '@prisma/client';

import { Button, Card, Input, Tooltip } from '@nextui-org/react';
import {
  Badge,
  BadgeCheck,
  CalendarClock,
  CircleDot,
  Filter,
  Search,
  X,
} from 'lucide-react';

import emptyIcon from '@/public/image/empty.svg';
import { progress, success, warning } from '@/lib/color';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/Sheet';
import AssetSideSheet from './AssetSideSheet';

interface AssetMaintenanceProps {
  maintenanceList: Maintenance[];
}

export default function AssetMaintenance({
  maintenanceList,
}: AssetMaintenanceProps) {
  const [searchId, setSearchId] = useState('');

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearchId(e.target.value);
  }

  function handleClearSearch() {
    setSearchId('');
  }

  return (
    <div className="flex flex-col flex-1 h-full space-y-4 pt-4 ">
      <div className="flex items-center justify-between">
        <Input
          size="sm"
          placeholder="Search"
          value={searchId}
          onChange={handleSearch}
          startContent={<Search size={18} />}
          endContent={
            searchId !== '' ? (
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={handleClearSearch}
              >
                <X size={18} />
              </Button>
            ) : null
          }
          className="max-w-screen-sm"
        />
        <Button isIconOnly variant="light" size="sm">
          <Filter size={18} />
        </Button>
      </div>
      {maintenanceList.filter(
        maintenance => maintenance.isOpen || maintenance.isClose,
      ).length === 0 ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <Image priority src={emptyIcon} alt="Empty list" width={70} />
          <span>No maintenance recorded</span>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-y-auto space-y-2 rounded">
            {maintenanceList.filter(
              maintenance =>
                maintenance.id.toLowerCase().includes(searchId.toLowerCase()) &&
                (maintenance.isOpen || maintenance.isClose),
            ).length > 0 ? (
              maintenanceList
                .filter(
                  maintenance =>
                    maintenance.id
                      .toLowerCase()
                      .includes(searchId.toLowerCase()) &&
                    (maintenance.isOpen || maintenance.isClose),
                )
                .map(maintenance => (
                  <Card
                    key={maintenance.id}
                    shadow="none"
                    className="flex flex-row items-center px-4 py-2 space-x-4"
                  >
                    {maintenance.isOpen &&
                      !maintenance.isClose &&
                      maintenance.startDate <= new Date() &&
                      maintenance.approvedOn === null && (
                        <Tooltip content="In progress">
                          <CircleDot
                            size={18}
                            color={progress}
                            className="hover:cursor-help"
                          />
                        </Tooltip>
                      )}
                    {maintenance.isOpen &&
                      !maintenance.isClose &&
                      maintenance.startDate > new Date() &&
                      maintenance.approvedOn === null && (
                        <Tooltip content="Scheduled Maintenance">
                          <CalendarClock
                            size={18}
                            className="hover:cursor-help"
                          />
                        </Tooltip>
                      )}
                    {maintenance.isClose && maintenance.approvedOn === null && (
                      <Tooltip content="Pending Approval">
                        <Badge
                          size={18}
                          color={warning}
                          className="hover:cursor-help"
                        />
                      </Tooltip>
                    )}
                    {maintenance.approvedOn !== null && maintenance.isClose && (
                      <Tooltip content="Closed and Approved">
                        <BadgeCheck
                          size={18}
                          color={success}
                          className="hover:cursor-help"
                        />
                      </Tooltip>
                    )}
                    <Sheet>
                      <SheetTrigger>
                        <span className="text-lg hover:underline hover:text-blue-500">
                          {maintenance.id}
                        </span>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>{maintenance.id}</SheetTitle>
                          <SheetDescription>
                            <AssetSideSheet maintenance={maintenance} />
                          </SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  </Card>
                ))
            ) : (
              <div className="flex flex-1 justify-center items-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Image priority src={emptyIcon} alt="Empty list" width={70} />
                  <span className="ml-2">No maintenance found</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
