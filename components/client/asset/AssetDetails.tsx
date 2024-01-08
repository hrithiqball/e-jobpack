import React, { useState, useTransition } from 'react';
import { asset, checklist_use, maintenance } from '@prisma/client';
import Image from 'next/image';
import moment from 'moment';
import { LuWrench } from 'react-icons/lu';
import {
  Avatar,
  AvatarGroup,
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
  User,
} from '@nextui-org/react';
import {
  BsFillPersonBadgeFill,
  BsPassFill,
  BsClockFill,
  BsClockHistory,
} from 'react-icons/bs';
import { createMaintenance } from '@/app/api/server-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AssetDetails({
  asset,
  checklistUse,
}: {
  asset: asset;
  checklistUse: checklist_use[];
}) {
  let [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [openCreateMaintenanceRequest, setOpenCreateMaintenanceRequest] =
    useState(false);

  function handleCreateMaintenance() {
    startTransition(() => {
      const newMaintenance = {
        uid: `WO-${Date.now().toString()}`,
        asset_uid: null,
        date: new Date(),
        maintainee: null,
        attachment_path: null,
        approved_by: null,
        approved_on: null,
        asset_ids: [asset.uid],
        deadline: null,
      } satisfies maintenance;

      createMaintenance(newMaintenance)
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
    <div className="flex flex-col sm:flex-row h-full p-4">
      <div className="flex-shrink-0 w-full mb-4 sm:mb-0 sm:w-3/4 mr-4">
        <Card className="p-4 flex-1 h-full">
          <div className="h-30 min-w-min">
            <div className="flex flex-row">
              <Image
                alt={asset.name}
                src={
                  'https://www.nu-heat.co.uk/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg'
                }
                width={500}
                height={800}
                className="object-cover rounded-md"
              />
              <Table
                className="mb-4 mx-4"
                aria-label="Asset Details"
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
                    <TableCell>
                      <span className="font-semibold">Description</span>
                    </TableCell>
                    <TableCell>{asset.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Type</span>
                    </TableCell>
                    <TableCell>
                      {asset.type === null || asset.type === ''
                        ? 'Not Specified'
                        : asset.type}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Created By</span>
                    </TableCell>
                    <TableCell>
                      {asset.created_by} on{' '}
                      {moment(asset.created_on).format('DD/MM/yyyy hh:mmA')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Location</span>
                    </TableCell>
                    <TableCell>
                      {asset.location === null || asset.location === ''
                        ? 'Not Specified'
                        : asset.location}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
      <div className="sm:flex flex-col w-full sm:w-1/4">
        <Card className="mb-4 p-4 flex-2 overflow-y-auto">
          <div className="flex flex-row items-center">
            <BsFillPersonBadgeFill />
            <span className="font-bold ml-4">Team</span>
          </div>
          <Table aria-label="Team" color="primary" hideHeader removeWrapper>
            <TableHeader>
              <TableColumn key="key">Key</TableColumn>
              <TableColumn key="value">Value</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">
                  Person In Charge
                </TableCell>
                <TableCell className="justify-center">
                  <User
                    name="Jane Doe"
                    description="Product Designer"
                    avatarProps={{
                      src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="semi-bold">Maintainer</TableCell>
                <TableCell>
                  <AvatarGroup isBordered max={5}>
                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                    <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                    <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                    <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                  </AvatarGroup>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
        <Card className="mb-4 p-4 flex-2 overflow-y-auto">
          <div className="flex flex-row items-center">
            <BsPassFill />
            <span className="font-bold ml-4">Checklist</span>
          </div>
          <div className="">
            {checklistUse.map(checklist => (
              <div key={checklist.uid} className="flex flex-row items-center">
                <Chip variant="flat">{checklist.title}</Chip>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4 flex-1 overflow-y-auto">
          <div className="flex flex-row items-center">
            <LuWrench />
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
                <TableCell className="font-semibold">
                  Next Maintenance
                </TableCell>
                <TableCell className="justify-center">
                  <Chip variant="flat" startContent={<BsClockFill size={18} />}>
                    {asset.next_maintenance !== null
                      ? moment(asset.next_maintenance).format('DD/MM/yyyy')
                      : 'No Scheduled Maintenance'}
                  </Chip>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="semi-bold">Last Maintenance</TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    startContent={<BsClockHistory size={18} />}
                  >
                    {asset.last_maintenance !== null
                      ? moment(asset.last_maintenance).format('DD/MM/yyyy')
                      : 'No Maintenance Completed'}
                  </Chip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button
            onClick={() => setOpenCreateMaintenanceRequest(true)}
            className="my-4"
            color="success"
            variant="faded"
          >
            Create Maintenance Request
          </Button>
          <Modal
            isOpen={openCreateMaintenanceRequest}
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
                {/* TODO: implement date picker like this https://github.com/nextui-org/nextui/discussions/1585 */}
                {/* TODO: add option to add other asset included in the maintenance */}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="faded"
                  onClick={() => setOpenCreateMaintenanceRequest(false)}
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
    </div>
  );
}
