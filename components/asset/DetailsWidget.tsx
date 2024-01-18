import React, { Key, useState, useTransition } from 'react';
import Image from 'next/image';

import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import z from 'zod';

import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import {
  CircleSlash,
  MoreHorizontal,
  PencilLine,
  Printer,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

import { fetchMutatedAssetItem, updateAsset } from '@/lib/actions/asset';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UpdateAsset } from '@/lib/schemas/asset';

interface DetailsWidgetProps {
  mutatedAsset: Awaited<ReturnType<typeof fetchMutatedAssetItem>>;
}

export default function DetailsWidget({ mutatedAsset }: DetailsWidgetProps) {
  let [isPending, startTransition] = useTransition();
  const user = useCurrentUser();
  const role = useCurrentRole();
  const { control, handleSubmit } = useForm<z.infer<typeof UpdateAsset>>();

  const [isEdit, setIsEdit] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedTag, setUpdatedTag] = useState('');

  async function onSubmit(data: z.infer<typeof UpdateAsset>) {
    try {
      const validatedData = UpdateAsset.parse(data);
      setIsEdit(false);

      startTransition(() => {
        if (user === undefined || user.id === undefined) {
          console.debug(isPending);
          toast.error('Session expired');
          return;
        }

        toast.promise(
          updateAsset(user.id, mutatedAsset.id, {
            ...validatedData,
            name: updatedName,
          }).then(() => setIsEdit(false)),
          {
            loading: 'Updating asset...',
            success: 'Asset updated!',
            error: 'Failed to update asset',
          },
        );
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.issues);
      } else {
        console.error(error);
      }
    }
  }

  function handleAssetAction(key: Key) {
    switch (key) {
      case 'edit-asset':
        setUpdatedName(mutatedAsset.name);
        setUpdatedTag(mutatedAsset.tag ?? '');
        setIsEdit(true);
        break;
      case 'print-asset':
        console.log(key);
        break;
    }
  }

  function handleCancel() {
    setUpdatedName('');
    setUpdatedTag('');
    setIsEdit(false);
  }

  return (
    <div className="flex w-3/4 p-2">
      <Card shadow="none" className="flex flex-1 p-4">
        <div className="flex flex-1 min-w-min">
          <div className="flex flex-1 flex-row">
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
                {isEdit ? (
                  <Input value={updatedName} onValueChange={setUpdatedName} />
                ) : (
                  <span className="font-bold text-3xl">
                    {mutatedAsset.name}
                  </span>
                )}
                <div className="flex items-center space-x-1">
                  {isEdit ? (
                    <ButtonGroup>
                      <Button
                        size="sm"
                        variant="faded"
                        color="danger"
                        startContent={<CircleSlash size={18} />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="faded"
                        color="success"
                        startContent={<Save size={18} />}
                        onClick={handleSubmit(onSubmit)}
                      >
                        Save
                      </Button>
                    </ButtonGroup>
                  ) : (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="faded">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        onAction={handleAssetAction}
                        disabledKeys={
                          role === 'TECHNICIAN' ? ['edit-asset'] : []
                        }
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
                  )}
                </div>
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
                      {isEdit ? (
                        <Controller
                          control={control}
                          name="description"
                          render={({ field }) => (
                            <Input
                              // size="sm"
                              // variant="faded"
                              {...field}
                              onFocus={e => {
                                // Add a focus event handler for debugging
                                console.log('Input field focused:', e);
                              }}
                            />
                          )}
                        />
                      ) : (
                        <span>
                          {mutatedAsset.description === '' ||
                          mutatedAsset.description === null
                            ? 'No description provided'
                            : mutatedAsset.description}
                        </span>
                      )}
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
                      {isEdit ? (
                        <Input
                          size="sm"
                          variant="faded"
                          value={updatedTag}
                          onValueChange={setUpdatedTag}
                        />
                      ) : (
                        <span>
                          {mutatedAsset.tag === '' || mutatedAsset.tag === null
                            ? 'No description provided'
                            : mutatedAsset.tag}
                        </span>
                      )}
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
