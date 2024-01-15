'use client';

import React, { useEffect, useState, Key, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AssetStatus, AssetType } from '@prisma/client';

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
import { PackagePlus } from 'lucide-react';

import { createAsset, fetchMutatedAssetList } from '@/lib/actions/asset';
import Loading from '@/components/client/Loading';
import AssetTable from '@/components/client/asset/AssetTable';

interface AssetListProps {
  mutatedAssetList: Awaited<ReturnType<typeof fetchMutatedAssetList>>;
  assetTypeList: AssetType[];
  assetStatusList: AssetStatus[];
}

export default function AssetList({
  mutatedAssetList,
  assetTypeList,
  assetStatusList,
}: AssetListProps) {
  let [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [openAddAsset, setOpenAddAsset] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetTag, setNewAssetTag] = useState('');
  const [newAssetDescription, setNewAssetDescription] = useState('');
  const [newAssetType, setNewAssetType] = useState('');
  const [newAssetStatus, setNewAssetStatus] = useState('');
  const [newAssetLocation, setNewAssetLocation] = useState('');

  function handleAssetType(e: any) {
    setNewAssetType(e.currentKey);
  }

  function handleAssetStatus(e: any) {
    setNewAssetStatus(e.currentKey);
  }

  function handleAddAsset() {
    if (session?.user.id === undefined || session?.user.id === null) {
      toast.error('User not found');
      return;
    }

    startTransition(() => {
      createAsset({
        createdBy: session.user.id,
        name: newAssetName,
        description: newAssetDescription,
        type: newAssetType ?? null,
        location: newAssetLocation,
        personInCharge: null,
        tag: newAssetTag,
      })
        .then(res => {
          if (isPending) console.info(res);
          toast.success(`Asset ${res.name} created successfully`);
          closeAddAssetModal();
          router.refresh();
        })
        .catch(err => {
          console.log(err);
          toast.error(`Asset cannot created, ${err}`);
        });
    });
  }

  function handleRowAction(key: Key) {
    const asset = mutatedAssetList.find(asset => asset.id === key);

    router.push(`/asset/${asset?.id}`);
  }

  function closeAddAssetModal() {
    setOpenAddAsset(false);
    setNewAssetName('');
    setNewAssetDescription('');
    setNewAssetType('');
    setNewAssetStatus('');
    setNewAssetLocation('');
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <div className="flex-1">
      <div className="flex justify-between">
        <span>Asset List</span>
        <Button
          onClick={() => setOpenAddAsset(!openAddAsset)}
          variant="faded"
          size="sm"
          endContent={<PackagePlus size={18} />}
        >
          Add Asset
        </Button>
        <Modal isOpen={openAddAsset} hideCloseButton backdrop="blur">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Add New Asset
            </ModalHeader>
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
                onSelectionChange={e => handleAssetStatus(e)}
              >
                {assetStatusList.map(assetStatus => (
                  <SelectItem key={assetStatus.id} value={assetStatus.id}>
                    {assetStatus.title}
                  </SelectItem>
                ))}
              </Select>
              {/* TODO: iterate real user id */}
              <Select label="Person in charge" variant="faded">
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
                onPress={closeAddAssetModal}
              >
                Close
              </Button>
              <Button
                isDisabled={newAssetName === ''}
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
      </div>
      <div className="flex flex-row justify-between h-full">
        <div className="flex-1">
          <AssetTable
            handleRowAction={handleRowAction}
            mutatedAssetList={mutatedAssetList}
          />
        </div>
      </div>
    </div>
  );
}
