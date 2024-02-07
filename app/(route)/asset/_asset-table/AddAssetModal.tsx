/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AssetStatus, AssetType, User } from '@prisma/client';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { toast } from 'sonner';

import { useCurrentUser } from '@/hooks/use-current-user';
import { createAsset } from '@/lib/actions/asset';
import { CreateAsset } from '@/lib/schemas/asset';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userList: User[];
  assetStatusList: AssetStatus[];
  assetTypeList: AssetType[];
}

export default function AddAssetModal({
  isOpen,
  onClose,
  userList,
  assetStatusList,
  assetTypeList,
}: AddAssetModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const user = useCurrentUser();

  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetTag, setNewAssetTag] = useState('');
  const [newAssetDescription, setNewAssetDescription] = useState('');
  const [newAssetType, setNewAssetType] = useState('');
  const [newAssetPIC, setNewAssetPIC] = useState('');
  const [newAssetStatus, setNewAssetStatus] = useState('');
  const [newAssetLocation, setNewAssetLocation] = useState('');

  function handleAddAsset() {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('User not found');
        return;
      }

      const validatedFields = CreateAsset.safeParse({
        createdById: user.id,
        name: newAssetName,
        description: newAssetDescription,
        type: newAssetType === '' ? null : newAssetType,
        location: newAssetLocation,
        personInCharge: newAssetPIC === '' ? null : newAssetPIC,
        tag: newAssetTag,
        statusId: newAssetStatus === '' ? null : newAssetStatus,
      });

      if (!validatedFields.success) {
        if (
          validatedFields.error &&
          validatedFields.error.issues &&
          validatedFields.error.issues[0]
        ) {
          toast.error(validatedFields.error?.issues[0]?.message);
        }
        return;
      }

      createAsset({ ...validatedFields.data })
        .then(res => {
          if (isPending) console.info(res);
          toast.success(`Asset ${res.name} created successfully`);
          onClose();
          router.refresh();
        })
        .catch(err => {
          console.log(err);
          toast.error(`Asset cannot created, ${err}`);
        });
    });
  }

  function handleAssetType(selection: any) {
    setNewAssetType(selection.currentKey);
  }

  function handleAssetStatus() {
    return (selection: any) => {
      setNewAssetStatus(selection.currentKey);
    };
  }

  function handlePersonInChargeSelection(selection: any) {
    setNewAssetPIC(selection.currentKey);
  }

  return (
    <Modal
      isOpen={isOpen}
      hideCloseButton
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add New Asset</ModalHeader>
        <ModalBody>
          <Input
            isRequired
            autoFocus
            label="Name"
            variant="faded"
            value={newAssetName}
            onValueChange={setNewAssetName}
          />
          <Input
            label="Description"
            variant="faded"
            value={newAssetDescription}
            onValueChange={setNewAssetDescription}
          />
          <Input
            label="Tag"
            variant="faded"
            value={newAssetTag}
            onValueChange={setNewAssetTag}
          />
          <Select
            label="Type of asset"
            variant="faded"
            value={newAssetType}
            onSelectionChange={e => handleAssetType(e)}
          >
            {assetTypeList.map(assetType => (
              <SelectItem key={assetType.id} value={assetType.id}>
                {assetType.title}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Location"
            variant="faded"
            value={newAssetLocation}
            onValueChange={setNewAssetLocation}
          />
          <Select
            label="Asset Status"
            variant="faded"
            value={newAssetStatus}
            onSelectionChange={handleAssetStatus}
          >
            {assetStatusList.map(assetStatus => (
              <SelectItem key={assetStatus.id} value={assetStatus.id}>
                {assetStatus.title}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Person in charge"
            variant="faded"
            onSelectionChange={selection =>
              handlePersonInChargeSelection(selection)
            }
          >
            {userList
              .filter(
                u =>
                  (u.role === 'SUPERVISOR' || u.role === 'ADMIN') &&
                  u.id !== '-99',
              )
              .map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="faded" onPress={onClose}>
            Close
          </Button>
          <Button
            isDisabled={newAssetName === '' || isPending}
            isLoading={isPending}
            variant="faded"
            color="primary"
            onPress={() => {
              handleAddAsset();
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
