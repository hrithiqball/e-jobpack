import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { User } from '@prisma/client';
import dayjs from 'dayjs';

import {
  Button,
  Card,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Clock, Wrench, History, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { createMaintenance } from '@/lib/actions/maintenance';
import { Calendar } from '@/components/ui/Calendar';
import { CreateMaintenance } from '@/lib/schemas/maintenance';
import { useCurrentUser } from '@/hooks/use-current-user';
import { fetchMutatedAssetItem } from '@/lib/actions/asset';

interface MaintenanceWidgetProps {
  mutatedAsset: Awaited<ReturnType<typeof fetchMutatedAssetItem>>;
  userList: User[];
}

export default function MaintenanceWidget({
  mutatedAsset,
  userList,
}: MaintenanceWidgetProps) {
  let [isPending, startTransition] = useTransition();
  const router = useRouter();
  const user = useCurrentUser();
  const [newMaintenanceId, setNewMaintenanceId] = useState<string>('');
  const [newMaintenanceDeadLine, setNewMaintenanceDeadLine] = useState<Date>();
  const [newMaintenanceMaintaineeList, setNewMaintenanceMaintaineeList] =
    useState(new Set([]));
  const [openCreateMaintenanceModal, setOpenCreateMaintenanceModal] =
    useState(false);

  function handleCreateMaintenance() {
    const maintainee = Array.from(newMaintenanceMaintaineeList);
    const validatedFields = CreateMaintenance.safeParse({
      id: newMaintenanceId,
      assetIds: [mutatedAsset.id],
      deadline: newMaintenanceDeadLine ?? null,
      maintainee,
    });

    if (!validatedFields.success) {
      toast.error(validatedFields.error.issues[0].message);
      return;
    }

    startTransition(() => {
      if (user === undefined) {
        toast.error('Session expired');
        return;
      }

      createMaintenance(user, {
        ...validatedFields.data,
      })
        .then(res => {
          if (!isPending) console.debug(res);
          toast.success('Work order request created successfully');
          router.push('/task');
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  return (
    <div className="flex flex-1 p-2">
      <Card className="flex flex-1 p-4">
        <div className="flex flex-row items-center">
          <Wrench />
          <span className="font-bold ml-4">Maintenance</span>
        </div>
        <Table
          className="mt-4"
          aria-label="Maintenance"
          color="primary"
          hideHeader
          removeWrapper
        >
          <TableHeader>
            <TableColumn key="key">Key</TableColumn>
            <TableColumn key="value">Value</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Upcoming</TableCell>
              <TableCell className="justify-center">
                <Chip
                  variant="faded"
                  size="sm"
                  startContent={<Clock size={18} />}
                >
                  <span className="ml-1">
                    {mutatedAsset.nextMaintenance !== null
                      ? dayjs(mutatedAsset.nextMaintenance).format('DD/MM/YYYY')
                      : 'No Scheduled Maintenance'}
                  </span>
                </Chip>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Last</TableCell>
              <TableCell className="justify-center">
                <Chip
                  variant="faded"
                  size="sm"
                  startContent={<History size={18} />}
                >
                  <span className="ml-1">
                    {mutatedAsset.lastMaintenance !== null
                      ? dayjs(mutatedAsset.lastMaintenance).format('DD/MM/YYYY')
                      : 'No Maintenance Completed'}
                  </span>
                </Chip>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button
          onClick={() => setOpenCreateMaintenanceModal(true)}
          className="my-4"
          color="success"
          variant="faded"
        >
          {user?.role === 'ADMIN' || user?.role === 'SUPERVISOR'
            ? 'Create New Maintenance'
            : 'Create Maintenance Request'}
        </Button>
        <Modal
          isOpen={openCreateMaintenanceModal}
          hideCloseButton
          backdrop="blur"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              {user?.role === 'ADMIN' || user?.role === 'SUPERVISOR'
                ? 'Create New Maintenance'
                : 'Create Maintenance Request'}
            </ModalHeader>
            <ModalBody>
              <Input
                isRequired
                label="Maintenance Request ID"
                variant="faded"
                size="sm"
                value={newMaintenanceId}
                onValueChange={setNewMaintenanceId}
              />
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="faded"
                    startContent={<CalendarIcon size={18} />}
                  >
                    Deadline
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={newMaintenanceDeadLine}
                    onSelect={setNewMaintenanceDeadLine}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select
                selectionMode="multiple"
                label="Assign To"
                variant="faded"
                size="sm"
                selectedKeys={newMaintenanceMaintaineeList}
                onSelectionChange={(e: any) =>
                  setNewMaintenanceMaintaineeList(e)
                }
              >
                {userList
                  .filter(user => user.id !== '-99')
                  .map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="faded"
                onClick={() => setOpenCreateMaintenanceModal(false)}
              >
                Close
              </Button>
              <Button
                color="primary"
                variant="faded"
                onClick={handleCreateMaintenance}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </div>
  );
}
