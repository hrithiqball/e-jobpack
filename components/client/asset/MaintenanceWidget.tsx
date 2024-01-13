import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Asset } from '@prisma/client';
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
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Clock, Wrench, History } from 'lucide-react';
import { toast } from 'sonner';

import { createMaintenance } from '@/lib/actions/maintenance';

interface MaintenanceWidgetProps {
  asset: Asset;
}

export default function MaintenanceWidget({ asset }: MaintenanceWidgetProps) {
  let [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [openCreateMaintenanceModal, setOpenCreateMaintenanceModal] =
    useState(false);

  function handleCreateMaintenance() {
    startTransition(() => {
      createMaintenance({
        maintainee: 'Harith',
      })
        .then(res => {
          if (!isPending) console.log(res);
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
                    {asset.nextMaintenance !== null
                      ? dayjs(asset.nextMaintenance).format('DD/MM/YYYY')
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
                    {asset.lastMaintenance !== null
                      ? dayjs(asset.lastMaintenance).format('DD/MM/YYYY')
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
          Create Maintenance Request
        </Button>
        <Modal
          isOpen={openCreateMaintenanceModal}
          hideCloseButton
          backdrop="blur"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Create Maintenance Request
            </ModalHeader>
            <ModalBody>
              <Input
                isReadOnly
                label="Maintenance Request ID"
                variant="faded"
                value={`WO-${Date.now().toString()}`}
              />
              <Select isMultiline label="Assign To" variant="faded">
                <SelectItem key="1" value="Harith">
                  Harith
                </SelectItem>
                <SelectItem key="2" value="Iqbal">
                  Iqbal
                </SelectItem>
                <SelectItem key="3" value="John">
                  John
                </SelectItem>
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
