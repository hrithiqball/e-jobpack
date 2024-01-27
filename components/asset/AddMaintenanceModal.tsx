import React, { useState, useTransition } from 'react';

import { User } from '@prisma/client';
import dayjs from 'dayjs';
import { z } from 'zod';

import {
  Button,
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
} from '@nextui-org/react';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useCurrentUser } from '@/hooks/use-current-user';
import { createMaintenance } from '@/lib/actions/maintenance';
import { CreateMaintenance } from '@/lib/schemas/maintenance';

interface AddMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetIds: string[] | [];
  userList: User[];
}

export default function AddMaintenanceModal({
  isOpen,
  onClose,
  assetIds,
  userList,
}: AddMaintenanceModalProps) {
  let [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const [maintenanceId, setMaintenanceId] = useState('');
  const [maintainee, setMaintainee] = useState(new Set([]));
  const [approvedBy, setApprovedBy] = useState(new Set([]));
  const [deadline, setDeadline] = useState<Date>();
  const [startDate, setStartDate] = useState<Date | undefined>(
    dayjs().toDate(),
  );

  function handleCreateMaintenance() {
    startTransition(() => {
      if (user === undefined) {
        toast.error('Session expired');
        return;
      }

      const maintenance: z.infer<typeof CreateMaintenance> = {
        assetIds,
        deadline,
        id: maintenanceId,
        maintainee: Array.from(maintainee),
        startDate: startDate || dayjs().toDate(),
        isOpen: user.role === 'ADMIN' || user.role === 'SUPERVISOR',
        isRequested: user.role !== 'ADMIN' && user.role !== 'SUPERVISOR',
        approvedById: Array.from(approvedBy)[0],
      };

      const validatedFields = CreateMaintenance.safeParse(maintenance);

      if (!validatedFields.success) {
        toast.error(validatedFields.error.issues[0].message);
        return;
      }

      toast.promise(
        createMaintenance(user, { ...validatedFields.data }).then(() => {
          setMaintenanceId('');
          setMaintainee(new Set([]));
          setDeadline(undefined);
          onClose();
        }),
        {
          loading:
            user.role === 'TECHNICIAN'
              ? 'Creating request...'
              : 'Creating maintenance',
          success:
            user.role === 'TECHNICIAN'
              ? 'Request submitted!'
              : 'Maintenance created!',
          error:
            user.role === 'TECHNICIAN'
              ? 'Failed to request 😔'
              : 'Failed to create',
        },
      );
    });
  }

  return (
    <Modal isOpen={isOpen} backdrop="blur" hideCloseButton>
      <ModalContent>
        <ModalHeader>
          <h2>Add Maintenance</h2>
        </ModalHeader>
        <ModalBody>
          <Input
            isRequired
            label={
              user?.role !== 'TECHNICIAN'
                ? 'Maintenance ID'
                : 'Maintenance Request ID'
            }
            variant="faded"
            size="sm"
            value={maintenanceId}
            onValueChange={setMaintenanceId}
          />
          <Select
            isRequired
            label="Person in charge"
            size="sm"
            variant="faded"
            selectionMode="single"
            selectedKeys={approvedBy}
            onSelectionChange={(e: any) => setApprovedBy(e)}
          >
            {userList
              .filter(user => user.id !== '-99' && user.role !== 'TECHNICIAN')
              .map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
          </Select>
          <Select
            selectionMode="multiple"
            label="Assign To"
            variant="faded"
            size="sm"
            selectedKeys={maintainee}
            onSelectionChange={(e: any) => setMaintainee(e)}
          >
            {userList
              .filter(user => user.id !== '-99')
              .map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
          </Select>
          <Popover>
            <PopoverTrigger>
              <Button variant="faded" className="flex justify-between">
                <span className="flex items-center space-x-2">
                  <CalendarIcon size={18} />
                  <span>Start Date</span>
                </span>
                <span>
                  {startDate && dayjs(startDate).format('DD/MM/YYYY')}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                initialFocus
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                fromDate={dayjs().toDate()}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <Button variant="faded" className="flex justify-between">
                <span className="flex items-center space-x-2">
                  <CalendarIcon size={18} />
                  <span>End Date</span>
                </span>
                <span>{deadline && dayjs(deadline).format('DD/MM/YYYY')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                initialFocus
                fromDate={startDate || dayjs().toDate()}
              />
            </PopoverContent>
          </Popover>
        </ModalBody>
        <ModalFooter>
          <Button variant="faded" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="faded"
            isLoading={isPending}
            disabled={maintenanceId === '' || isPending}
            size="sm"
            color="primary"
            onClick={handleCreateMaintenance}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
