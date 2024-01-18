import React, { Key } from 'react';
import Image from 'next/image';

import dayjs from 'dayjs';

import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { MoreHorizontal, PencilLine, Printer } from 'lucide-react';

import { fetchMutatedAssetItem } from '@/lib/actions/asset';
import { useCurrentRole } from '@/hooks/use-current-role';

interface DetailsWidgetProps {
  mutatedAsset: Awaited<ReturnType<typeof fetchMutatedAssetItem>>;
}

export default function DetailsWidget({ mutatedAsset }: DetailsWidgetProps) {
  const role = useCurrentRole();

  function handleAssetAction(key: Key) {
    switch (key) {
      case 'edit-asset':
        console.log(key);
        break;
      case 'print-asset':
        console.log(key);
        break;
    }
  }

  return (
    <div className="flex w-3/4 p-2">
      <Card shadow="none" className="flex flex-1 p-4">
        <div className="h-30 min-w-min">
          <div className="flex flex-row">
            <Image
              alt={mutatedAsset.name}
              src={
                'https://www.nu-heat.co.uk/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg'
              }
              width={500}
              height={800}
              className="object-cover rounded-md"
            />
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between ml-8">
                <span className="font-bold text-3xl">{mutatedAsset.name}</span>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="faded">
                      <MoreHorizontal size={18} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    onAction={handleAssetAction}
                    disabledKeys={role === 'TECHNICIAN' ? ['edit-asset'] : []}
                  >
                    <DropdownItem
                      key="edit-asset"
                      startContent={<PencilLine size={18} />}
                    >
                      Edit Asset
                    </DropdownItem>
                    <DropdownItem
                      key="print-asset"
                      startContent={<Printer size={18} />}
                    >
                      Print to PDF
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <Divider className="m-4" />
              <Table
                aria-label="Asset Details"
                color="primary"
                hideHeader
                removeWrapper
                className="mx-4"
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
                    <TableCell>
                      {mutatedAsset.description === '' ||
                      mutatedAsset.description === null
                        ? 'No description provided'
                        : mutatedAsset.description}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Status</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="faded"
                        startContent={
                          <div
                            style={{
                              backgroundColor:
                                mutatedAsset.status?.color ?? 'grey',
                            }}
                            className="w-1 p-1 rounded-full mx-1"
                          ></div>
                        }
                      >
                        {mutatedAsset.status?.title === '' ||
                        mutatedAsset.status?.title === undefined
                          ? 'Not Specified'
                          : mutatedAsset.status.title}
                      </Chip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Tag</span>
                    </TableCell>
                    <TableCell>
                      {mutatedAsset.tag === '' || mutatedAsset.tag === null
                        ? 'No description provided'
                        : mutatedAsset.tag}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Type</span>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="faded">
                        {mutatedAsset.type?.title}
                      </Chip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Location</span>
                    </TableCell>
                    <TableCell>
                      {mutatedAsset.location === null ||
                      mutatedAsset.location === ''
                        ? 'Not Specified'
                        : mutatedAsset.location}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Updated by</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Avatar
                          size="sm"
                          showFallback
                          src={mutatedAsset.updatedBy.image ?? ''}
                          name={mutatedAsset.updatedBy.name}
                          className="mr-1"
                        />
                        <span>on</span>
                        <span>
                          {dayjs(mutatedAsset.updatedOn).format(
                            'DD/MM/YYYY hh:mmA',
                          )}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Created by</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Avatar
                          size="sm"
                          showFallback
                          src={mutatedAsset.createdBy.image ?? ''}
                          name={mutatedAsset.createdBy.name}
                          className="mr-1"
                        />
                        <span>on</span>
                        <span>
                          {dayjs(mutatedAsset.createdOn).format(
                            'DD/MM/YYYY hh:mmA',
                          )}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
