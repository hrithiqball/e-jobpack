import React, { useState, useTransition } from 'react';

import { User } from '@prisma/client';

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
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useCurrentUser } from '@/hooks/use-current-user';
import { createMaintenance } from '@/lib/actions/maintenance';
import { CreateMaintenance } from '@/lib/schemas/maintenance';
import { Calendar } from '@/components/ui/Calendar';

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
  const [deadline, setDeadline] = useState<Date>();

  function handleCreateMaintenance() {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      const validatedFields = CreateMaintenance.safeParse({
        id: maintenanceId,
        maintainee: Array.from(maintainee),
        assetIds,
        deadline,
        isOpen: user.role === 'ADMIN' || user.role === 'SUPERVISOR',
      });

      if (!validatedFields.success) {
        toast.error('Invalid input');
        return;
      }

      toast.promise(
        createMaintenance(user.id, { ...validatedFields.data }).then(() => {
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
              <Button variant="faded" startContent={<CalendarIcon size={18} />}>
                Deadline
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                initialFocus
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
