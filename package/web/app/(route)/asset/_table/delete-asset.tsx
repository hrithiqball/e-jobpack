import { useTransition } from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { Archive } from 'lucide-react';
import { toast } from 'sonner';

import { useCurrentUser } from '@/hooks/use-current-user';
import { deleteAsset, updateAsset } from '@/lib/actions/asset';

type DeleteAssetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  assetId: string;
};

export default function DeleteAssetModal({
  isOpen,
  onClose,
  assetId,
}: DeleteAssetModalProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();

  function handleDeleteAsset() {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      deleteAsset(user.id, assetId)
        .then(() => {
          toast.success(`Asset ${assetId} deleted`);
          onClose();
        })
        .catch(error => {
          toast.error(error.message);
        });
    });
  }

  function handleArchiveAsset() {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      updateAsset(user.id, assetId, { isArchive: true })
        .then(() => {
          toast.success(`Asset ${assetId} archived`);
          onClose();
        })
        .catch(error => {
          toast.error(error.message);
        });
    });
  }

  return (
    <Modal isOpen={isOpen} hideCloseButton backdrop="blur">
      <ModalContent>
        <ModalHeader>Delete Asset</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete this asset? Once you delete this
            asset, it will be gone forever including the data and history.
            Please proceed with caution. Archive instead if you want to keep the
            data and history.
          </p>
          <div className="flex items-center justify-center">
            <Button
              variant="faded"
              startContent={<Archive />}
              onClick={handleArchiveAsset}
            >
              Archive
            </Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="faded" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="faded"
            size="sm"
            color="primary"
            isDisabled={transitioning}
            isLoading={transitioning}
            onClick={handleDeleteAsset}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
