'use client';

import dayjs from 'dayjs';

import { Card, CardHeader, Chip, Divider, Link } from '@nextui-org/react';

import { MaintenanceList } from '@/types/maintenance';

import MyTaskBoardHelper from '@/components/helper/MyTaskBoardHelper';

type TaskComponentProps = {
  maintenanceList: MaintenanceList;
};

export default function TaskComponent({ maintenanceList }: TaskComponentProps) {
  return (
    <div className="flex flex-1 flex-grow flex-col rounded-md">
      <div className="flex h-full w-full flex-1 flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Card shadow="none" className="w-100 flex-1 p-4 dark:bg-card">
          <div>
            <div className="mb-4 flex items-center justify-center space-x-4">
              <span className="text-lg font-semibold">My Tasks</span>
              <Chip size="sm" variant="faded">
                {
                  maintenanceList.filter(
                    mtn =>
                      (mtn.maintenanceStatus === 'OPENED' ||
                        mtn.maintenanceStatus === 'REQUESTED') &&
                      mtn.startDate < dayjs().add(1, 'day').toDate(),
                  ).length
                }
              </Chip>
            </div>
            <Divider />
            {maintenanceList
              .filter(
                mtn =>
                  (mtn.maintenanceStatus === 'OPENED' ||
                    mtn.maintenanceStatus === 'REQUESTED') &&
                  mtn.startDate < dayjs().add(1, 'day').toDate(),
              )
              .map(maintenance => (
                <Card
                  key={maintenance.id}
                  as={Link}
                  href={`/task/${maintenance.id}`}
                  shadow="none"
                  className="my-4 w-full bg-zinc-200 dark:bg-zinc-900"
                >
                  <CardHeader>
                    <MyTaskBoardHelper maintenance={maintenance} />
                  </CardHeader>
                </Card>
              ))}
          </div>
        </Card>
        <Card shadow="none" className="flex-1 p-4 dark:bg-card">
          <div>
            <div className="mb-4 flex items-center justify-center space-x-4">
              <span className="text-lg font-semibold">Completed Tasks</span>
              <Chip size="sm" variant="faded">
                {maintenanceList.filter(m => m.isClose).length}
              </Chip>
            </div>
            <Divider />
            {maintenanceList
              .filter(
                mtn =>
                  mtn.maintenanceStatus === 'CLOSED' ||
                  mtn.maintenanceStatus === 'APPROVED',
              )
              .map(maintenance => (
                <Card
                  key={maintenance.id}
                  as={Link}
                  href={`/task/${maintenance.id}`}
                  shadow="none"
                  className="my-4 w-full bg-zinc-200 dark:bg-zinc-900"
                >
                  <CardHeader>
                    <MyTaskBoardHelper maintenance={maintenance} />
                  </CardHeader>
                </Card>
              ))}
          </div>
        </Card>
        <Card shadow="none" className="flex-1 p-4 dark:bg-card">
          <div>
            <div className="mb-4 flex items-center justify-center space-x-4">
              <span className="text-lg font-semibold">Upcoming Tasks</span>
              <Chip size="sm" variant="faded">
                {
                  maintenanceList.filter(
                    m => m.startDate && m.startDate > new Date(),
                  ).length
                }
              </Chip>
            </div>
            <Divider />
            {maintenanceList
              .filter(m => m.startDate && m.startDate > new Date())
              .map(maintenance => (
                <Card
                  key={maintenance.id}
                  as={Link}
                  href={`/task/${maintenance.id}`}
                  shadow="none"
                  className="my-4 w-full"
                >
                  <CardHeader>
                    <MyTaskBoardHelper maintenance={maintenance} />
                  </CardHeader>
                </Card>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
