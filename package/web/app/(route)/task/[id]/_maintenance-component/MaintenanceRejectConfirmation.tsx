import React, { useState, useTransition } from 'react';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { toast } from 'sonner';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { updateMaintenance } from '@/lib/actions/maintenance';

type MaintenanceRejectConfirmationProps = {
  open: boolean;
  onClose: () => void;
};

export default function MaintenanceRejectConfirmation({
  open,
  onClose,
}: MaintenanceRejectConfirmationProps) {
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { maintenance } = useMaintenanceStore();

  const [rejectReason, setRejectReason] = useState('');

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
    }
  }

  function handleRejectMaintenance() {
    if (user === undefined || user.id === undefined) {
      toast.error('Session expired');
      return;
    }

    if (!maintenance) {
      toast.error('Maintenance not found');
      return;
    }

    startTransition(() => {
      toast.promise(
        updateMaintenance(maintenance.id, {
          isRejected: true,
          isRequested: false,
          isOpen: false,
          rejectReason,
          rejectedById: user.id,
          rejectedOn: new Date(),
        }),
        {
          loading: 'Rejecting maintenance...',
          success: res => {
            setRejectReason('');
            onClose();

            return toast.success(`Maintenance ${res.id} request rejected`);
          },
          error: 'Failed to reject maintenance request 😥',
        },
      );
    });
  }

  return isDesktop ? (
    <Modal hideCloseButton backdrop="blur" isOpen={open}>
      <ModalContent>
        <ModalHeader>Reject Maintenance Request</ModalHeader>
        <ModalBody>
          <Input
            size="sm"
            variant="faded"
            placeholder="Reject message...(optional)"
            isDisabled={isPending}
            value={rejectReason}
            onValueChange={setRejectReason}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="faded" isDisabled={isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="faded"
            color="danger"
            isDisabled={isPending}
            onClick={handleRejectMaintenance}
            isLoading={isPending}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>Reject Maintenance Request</DrawerHeader>
        <div className="flex px-4">
          <Input
            size="sm"
            variant="faded"
            placeholder="Reject message...(optional)"
            value={rejectReason}
            onValueChange={setRejectReason}
          />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="faded" isDisabled={isPending} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="faded"
              color="danger"
              isDisabled={isPending}
              isLoading={isPending}
              onClick={handleRejectMaintenance}
            >
              Confirm
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
