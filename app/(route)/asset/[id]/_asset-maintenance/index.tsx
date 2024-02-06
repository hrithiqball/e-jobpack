import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { Maintenance } from '@prisma/client';

import { Button, Card, Chip, Input, Tooltip } from '@nextui-org/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Badge,
  BadgeCheck,
  BadgeHelp,
  BadgePercent,
  BadgeX,
  CalendarClock,
  Filter,
  Search,
  X,
} from 'lucide-react';

import { approved, progress, reject, schedule_pending } from '@/lib/color';
import emptyIcon from '@/public/image/empty.svg';

import AssetSideSheet from './AssetSideSheet';

type AssetMaintenanceProps = {
  maintenanceList: Maintenance[];
};

export default function AssetMaintenance({
  maintenanceList,
}: AssetMaintenanceProps) {
  const [searchId, setSearchId] = useState('');
  const [isRejectedList, setIsRejectedList] = useState(false);

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearchId(e.target.value);
  }

  function handleClearSearch() {
    setSearchId('');
  }

  return (
    <div className="flex h-full flex-1 flex-col space-y-4 pt-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
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
        <Button
          size="sm"
          variant="faded"
          onClick={() => setIsRejectedList(!isRejectedList)}
          endContent={
            <Chip size="sm" variant="solid">
              {
                maintenanceList.filter(maintenance => maintenance.isRejected)
                  .length
              }
            </Chip>
          }
        >
          {isRejectedList ? 'Show All' : 'Show Rejected'}
        </Button>
      </div>
      {!isRejectedList ? (
        maintenanceList.filter(
          maintenance => maintenance.isOpen || maintenance.isClose,
        ).length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Image priority src={emptyIcon} alt="Empty list" width={70} />
            <span>No maintenance recorded</span>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col space-y-2 overflow-y-auto rounded">
              {maintenanceList.filter(
                maintenance =>
                  maintenance.id
                    .toLowerCase()
                    .includes(searchId.toLowerCase()) &&
                  !maintenance.isRejected,
              ).length > 0 ? (
                maintenanceList
                  .filter(
                    maintenance =>
                      maintenance.id
                        .toLowerCase()
                        .includes(searchId.toLowerCase()) &&
                      !maintenance.isRejected,
                  )
                  .map(maintenance => (
                    <Card
                      key={maintenance.id}
                      shadow="none"
                      className="flex flex-row items-center space-x-4 px-4 py-2"
                    >
                      {maintenance.isRequested && (
                        <Tooltip content="Requested">
                          <BadgeHelp
                            size={18}
                            color={schedule_pending}
                            className="hover:cursor-help"
                          />
                        </Tooltip>
                      )}
                      {maintenance.isOpen &&
                        !maintenance.isClose &&
                        maintenance.startDate <= new Date() &&
                        maintenance.approvedOn === null && (
                          <Tooltip content="In progress">
                            <BadgePercent
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
                              color={schedule_pending}
                              className="hover:cursor-help"
                            />
                          </Tooltip>
                        )}
                      {maintenance.isClose &&
                        maintenance.approvedOn === null && (
                          <Tooltip content="Pending Approval">
                            <Badge
                              size={18}
                              color={schedule_pending}
                              className="hover:cursor-help"
                            />
                          </Tooltip>
                        )}
                      {maintenance.approvedOn !== null &&
                        maintenance.isClose && (
                          <Tooltip content="Closed and Approved">
                            <BadgeCheck
                              size={18}
                              color={approved}
                              className="hover:cursor-help"
                            />
                          </Tooltip>
                        )}
                      <Sheet>
                        <SheetTrigger>
                          <span className="text-lg hover:text-blue-500 hover:underline">
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
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Image
                      priority
                      src={emptyIcon}
                      alt="Empty list"
                      width={70}
                    />
                    <span className="ml-2">No maintenance found</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      ) : maintenanceList.filter(maintenance => maintenance.isRejected)
          .length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Image priority src={emptyIcon} alt="Empty list" width={70} />
          <span>No maintenance recorded</span>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col space-y-2 overflow-y-auto rounded">
            {maintenanceList.filter(
              maintenance =>
                maintenance.id.toLowerCase().includes(searchId.toLowerCase()) &&
                maintenance.isRejected,
            ).length > 0 ? (
              maintenanceList
                .filter(
                  maintenance =>
                    maintenance.id
                      .toLowerCase()
                      .includes(searchId.toLowerCase()) &&
                    maintenance.isRejected,
                )
                .map(maintenance => (
                  <Card
                    key={maintenance.id}
                    shadow="none"
                    className="flex flex-row items-center space-x-4 px-4 py-2"
                  >
                    <Tooltip content="Rejected">
                      <BadgeX
                        size={18}
                        color={reject}
                        className="hover:cursor-help"
                      />
                    </Tooltip>
                    <Sheet>
                      <SheetTrigger>
                        <span className="text-lg hover:text-blue-500 hover:underline">
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
              <div className="flex flex-1 items-center justify-center">
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
