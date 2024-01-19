'use client';

import React, { useEffect, useState } from 'react';

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

import Loading from '@/components/Loading';
import { useCurrentRole } from '@/hooks/use-current-role';

interface TaskComponentProps {
  maintenanceList: Maintenance[];
}

export default function TaskComponent({ maintenanceList }: TaskComponentProps) {
  const role = useCurrentRole();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <div className="flex flex-col flex-1 rounded-md flex-grow">
      <div className="flex flex-1 flex-col space-y-4 h-full w-full sm:flex-row sm:space-y-0 sm:space-x-4">
        <Card className="flex-1 p-4 w-100">
          <div>
            <div className="space-x-4 items-center flex justify-center mb-4">
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
                <Card key={maintenance.id} className="w-full my-4">
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
                    <Card key={maintenance.id} className="w-full my-4">
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
                            name={maintenance.requestedBy ?? 'Me'}
                          />
                        </div>
                      </CardHeader>
                    </Card>
                  )))}
          </div>
        </Card>
        <Card className="flex-1 p-4">
          <div>
            <div className="space-x-4 items-center flex justify-center mb-4">
              <span className="text-lg font-semibold">Completed Tasks</span>
              <Chip size="sm" variant="faded">
                {maintenanceList.filter(m => m.isClose).length}
              </Chip>
            </div>
            <Divider />
            {maintenanceList
              .filter(m => m.isClose)
              .map(maintenance => (
                <Card key={maintenance.id} className="w-full my-4">
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
        <Card className="flex-1 p-4">
          <div>
            <div className="space-x-4 items-center flex justify-center mb-4">
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
                <Card key={maintenance.id} className="w-full my-4">
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
