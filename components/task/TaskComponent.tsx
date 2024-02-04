'use client';

import { Maintenance } from '@prisma/client';
import dayjs from 'dayjs';

import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Link,
} from '@nextui-org/react';
import { motion } from 'framer-motion';
import { FileCog, Wrench } from 'lucide-react';

import { useCurrentRole } from '@/hooks/use-current-role';

type TaskComponentProps = {
  maintenanceList: Maintenance[];
};

export default function TaskComponent({ maintenanceList }: TaskComponentProps) {
  const role = useCurrentRole();

  return (
    <div className="flex flex-1 flex-grow flex-col rounded-md">
      <div className="flex h-full w-full flex-1 flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Card shadow="none" className="w-100 flex-1 p-4">
          <div>
            <div className="mb-4 flex items-center justify-center space-x-4">
              <span className="text-lg font-semibold">My Tasks</span>
              <Chip size="sm" variant="faded">
                {
                  maintenanceList.filter(
                    m =>
                      !m.isClose &&
                      m.startDate < dayjs().add(1, 'day').toDate(),
                  ).length
                }
              </Chip>
            </div>
            <Divider />
            {maintenanceList
              .filter(
                m =>
                  !m.isClose &&
                  m.isOpen &&
                  m.startDate < dayjs().add(1, 'day').toDate(),
              )
              .map(maintenance => (
                <Card
                  shadow="none"
                  key={maintenance.id}
                  className="my-4 w-full"
                >
                  <CardHeader className="flex gap-3">
                    <Button color="danger" isIconOnly>
                      <Wrench />
                    </Button>
                    <div className="flex flex-col">
                      <Link
                        className="text-lg"
                        href={`/task/${maintenance.id}`}
                      >
                        {maintenance.id}
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            {role === 'ADMIN' ||
              (role === 'SUPERVISOR' &&
                maintenanceList
                  .filter(m => !m.isOpen)
                  .map(maintenance => (
                    <Card
                      shadow="none"
                      key={maintenance.id}
                      className="my-4 w-full"
                    >
                      <CardHeader className="flex gap-3">
                        <Button color="success" isIconOnly>
                          <motion.div whileHover={{ scale: 1.2 }}>
                            <FileCog color="#ffffff" />
                          </motion.div>
                        </Button>
                        <div className="flex flex-1 items-center justify-between">
                          <Link
                            href={`/task/${maintenance.id}`}
                            className="text-lg"
                          >
                            {maintenance.id}
                          </Link>
                          <Avatar
                            size="sm"
                            name={maintenance.requestedById ?? 'Me'}
                          />
                        </div>
                      </CardHeader>
                    </Card>
                  )))}
          </div>
        </Card>
        <Card shadow="none" className="flex-1 p-4">
          <div>
            <div className="mb-4 flex items-center justify-center space-x-4">
              <span className="text-lg font-semibold">Completed Tasks</span>
              <Chip size="sm" variant="faded">
                {maintenanceList.filter(m => m.isClose).length}
              </Chip>
            </div>
            <Divider />
            {maintenanceList
              .filter(m => m.isClose)
              .map(maintenance => (
                <Card key={maintenance.id} className="my-4 w-full">
                  <CardHeader className="flex gap-3">
                    <Button color="danger" isIconOnly>
                      <Wrench />
                    </Button>
                    <div className="flex flex-col">
                      <Link
                        href={`/task/${maintenance.id}`}
                        className="text-lg"
                      >
                        {maintenance.id}
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </Card>
        <Card shadow="none" className="flex-1 p-4">
          <div>
            <div className="mb-4 flex items-center justify-center space-x-4">
              <span className="text-lg font-semibold">Upcoming Tasks</span>
              <Chip size="sm" variant="faded">
                {
                  maintenanceList.filter(
                    m => m.startDate !== null && m.startDate > new Date(),
                  ).length
                }
              </Chip>
            </div>
            <Divider />
            {maintenanceList
              .filter(m => m.startDate !== null && m.startDate > new Date())
              .map(maintenance => (
                <Card
                  key={maintenance.id}
                  shadow="none"
                  className="my-4 w-full"
                >
                  <CardHeader className="flex gap-3">
                    <Button color="danger" isIconOnly>
                      <Wrench />
                    </Button>
                    <div className="flex flex-col">
                      <Link
                        href={`/task/${maintenance.id}`}
                        className="text-lg"
                      >
                        {maintenance.id}
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
