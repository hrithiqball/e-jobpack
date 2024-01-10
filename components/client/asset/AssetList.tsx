'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  ReactNode,
  Key,
  useTransition,
} from 'react';
import {
  Button,
  Card,
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
import { useTheme } from 'next-themes';
import Loading from '@/components/client/Loading';
import Link from 'next/link';
import { Asset, AssetStatus, AssetType } from '@prisma/client';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PackagePlus } from 'lucide-react';
import { createAsset } from '@/lib/actions/asset';

export default function AssetList({
  assetList,
  assetTypeList,
  assetStatusList,
}: {
  assetList: Asset[];
  assetTypeList: AssetType[];
  assetStatusList: AssetStatus[];
}) {
  let [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
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

  const renderCell = useCallback((asset: Asset, columnKey: Key) => {
    const cellValue = asset[columnKey as keyof Asset];

    switch (columnKey) {
      case 'name':
        return (
          <Link
            className="hover:underline hover:text-blue-400"
            href={{
              pathname: `/asset/${asset.uid}`,
              query: {
                name: asset.name,
                description: asset.description,
                type: asset.type,
                created_by: asset.createdBy,
                created_on: asset.createdOn.toString(),
                updated_by: asset.updatedBy,
                updated_on: asset.updatedOn.toString(),
                last_maintenance: asset.lastMaintenance?.toString(),
                last_maintainee: asset.lastMaintainee,
                location: asset.location,
                next_maintenance: asset.nextMaintenance?.toString(),
                status_uid: asset.statusId,
                person_in_charge: asset.personInCharge,
              },
            }}
          >
            {asset.name}
          </Link>
        );
      case 'type':
        return (
          <span>
            {asset.type === null || asset.type === ''
              ? 'Not Specified'
              : asset.type}
          </span>
        );
      default:
        return cellValue;
    }
  }, []);

  function handleAddAsset() {
    if (session?.user.id === undefined || session?.user.id === null) {
      toast.error('User not found');
      return;
    }

    const newAsset = {
      uid: `AS-${moment().format('YYMMDDHHmmssSSS')}`,
      name: newAssetName,
      description: newAssetDescription,
      type: newAssetType || null,
      location: newAssetLocation,
      createdBy: session.user.id,
      createdOn: new Date(),
      updatedBy: session.user.id,
      updatedOn: new Date(),
      personInCharge: null,
      lastMaintenance: null,
      nextMaintenance: null,
      lastMaintainee: [],
      tag: newAssetTag,
      statusId: newAssetStatus || null,
    } satisfies Asset;

    startTransition(() => {
      createAsset(newAsset)
        .then(res => {
          if (isPending) console.info(res);
          toast.success(`Asset ${newAsset.name} created successfully`);
          closeAddAssetModal();
          router.refresh();
        })
        .catch(err => {
          console.log(err);
          toast.error(`Asset ${newAsset.name} not created`);
        });
    });
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
    <Card
      className={`rounded-md p-4 m-4 flex-grow ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      }`}
    >
      <div className="flex justify-between">
        <span>Asset List</span>
        <Button
          onClick={() => setOpenAddAsset(!openAddAsset)}
          variant="ghost"
          size="sm"
          endContent={<PackagePlus />}
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
              {/* <Dropdown>
                <DropdownTrigger>
                  <Button>Open Menu</Button>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(e: Key) => console.log(e)}
                  aria-label="Type of asset"
                  items={assetTypeList}
                >
                  {(item) => (
                    <DropdownItem key={item.uid}>
                      {item.title}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown> */}
              <Select
                label="Type of asset"
                variant="faded"
                value={newAssetType}
                onSelectionChange={e => handleAssetType(e)}
              >
                {assetTypeList.map(assetType => (
                  <SelectItem key={assetType.uid} value={assetType.uid}>
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
                  <SelectItem key={assetStatus.uid} value={assetStatus.uid}>
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
          <Table
            color="primary"
            selectionMode="single"
            className="mt-4"
            aria-label="Asset List"
          >
            <TableHeader>
              <TableColumn key="name">Name</TableColumn>
              <TableColumn key="tag">Tag</TableColumn>
              <TableColumn key="description">Description</TableColumn>
              <TableColumn key="type">Type</TableColumn>
              <TableColumn key="location">Location</TableColumn>
              <TableColumn key="person_in_charge">Person In Charge</TableColumn>
            </TableHeader>
            <TableBody items={assetList}>
              {(item: Asset) => (
                <TableRow key={item.uid}>
                  {columnKey => (
                    <TableCell>
                      {renderCell(item, columnKey) as ReactNode}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
