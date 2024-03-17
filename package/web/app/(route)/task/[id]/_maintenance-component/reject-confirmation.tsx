import { useState, useTransition } from 'react';

import {
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';

import { updateMaintenance } from '@/data/maintenance.action';

type MaintenanceRejectConfirmationProps = {
  open: boolean;
  onClose: () => void;
};

export default function MaintenanceRejectConfirmation({
  open,
  onClose,
}: MaintenanceRejectConfirmationProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { maintenance } = useMaintenanceStore();

  const [rejectReason, setRejectReason] = useState('');

  function handleOpenChange() {
    onClose();
  }

  function handleRejectMaintenance() {
    if (!user || !user.id) {
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
            type="search"
            placeholder="Reject message...(optional)"
            disabled={transitioning}
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" disabled={transitioning} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={transitioning}
            onClick={handleRejectMaintenance}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : (
    <Drawer open={open} onClose={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>Reject Maintenance Request</DrawerHeader>
        <div className="flex px-4">
          <Input
            type="text"
            placeholder="Reject message...(optional)"
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
          />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button
              variant="outline"
              disabled={transitioning}
              onClick={onClose}
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
