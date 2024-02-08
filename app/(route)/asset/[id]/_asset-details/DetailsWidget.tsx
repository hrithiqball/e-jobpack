import { Key, useState, useTransition } from 'react';
import Image from 'next/image';

import { AssetStatus, AssetType } from '@prisma/client';
import dayjs from 'dayjs';
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

import { updateAsset } from '@/lib/actions/asset';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UpdateAsset } from '@/lib/schemas/asset';
import { MutatedAsset } from '@/types/asset';

type DetailsWidgetProps = {
  mutatedAsset: MutatedAsset;
  statusList: AssetStatus[];
  typeList: AssetType[];
};

export default function DetailsWidget({
  mutatedAsset,
  statusList,
  typeList,
}: DetailsWidgetProps) {
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();
  const role = useCurrentRole();
  // const { control, handleSubmit } = useForm<z.infer<typeof UpdateAsset>>();

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof UpdateAsset>>({
    name: '',
    description: '',
    tag: '',
    location: '',
  });

  // hook form
  // async function onSubmit(data: z.infer<typeof UpdateAsset>) {
  //   try {
  //     const validatedData = UpdateAsset.parse(data);
  //     setIsEdit(false);

  //     startTransition(() => {
  //       if (user === undefined || user.id === undefined) {
  //         console.debug(isPending);
  //         toast.error('Session expired');
  //         return;
  //       }

  //       toast.promise(
  //         updateAsset(user.id, mutatedAsset.id, {
  //           ...validatedData,
  //           name: updatedName,
  //         }).then(() => setIsEdit(false)),
  //         {
  //           loading: 'Updating asset...',
  //           success: 'Asset updated!',
  //           error: 'Failed to update asset',
  //         },
  //       );
  //     });
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       console.log(error.issues);
  //     } else {
  //       console.error(error);
  //     }
  //   }
  // }

  function handleUpdateAsset() {
    const validatedFields = UpdateAsset.safeParse(formData);

    if (!validatedFields.success) {
      toast.error(validatedFields.error?.issues[0]?.message);
      return;
    }

    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        console.debug(isPending);
        toast.error('Session expired');
        return;
      }

      toast.promise(
        updateAsset(user.id, mutatedAsset.id, {
          ...validatedFields.data,
        }).then(() => setIsEdit(false)),
        {
          loading: 'Updating asset...',
          success: 'Asset updated!',
          error: 'Failed to update asset',
        },
      );
    });

    console.log(formData);
    setIsEdit(false);
  }

  function handleStatusAction(key: Key) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        console.debug(isPending);
        toast.error('Session expired');
        return;
      }

      toast.promise(
        updateAsset(user.id, mutatedAsset.id, {
          statusId: key as string,
        }),
        {
          loading: 'Updating status...',
          success: 'Status updated!',
          error: 'Failed to update status',
        },
      );
    });
  }

  function handleTypeAction(key: Key) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        console.debug(isPending);
        toast.error('Session expired');
        return;
      }

      toast.promise(
        updateAsset(user.id, mutatedAsset.id, {
          type: key as string,
        }),
        {
          loading: 'Updating type...',
          success: 'Type updated!',
          error: 'Failed to update type',
        },
      );
    });
  }

  function handleAssetAction(key: Key) {
    switch (key) {
      case 'edit-asset':
        setFormData({
          name: mutatedAsset.name,
          description: mutatedAsset.description ?? '',
          tag: mutatedAsset.tag ?? '',
          location: mutatedAsset.location ?? '',
        });
        setIsEdit(true);
        break;
      case 'print-asset':
        console.log(key);
        break;
    }
  }

  function handleCancel() {
    setFormData({
      name: '',
      description: '',
      tag: '',
      location: '',
    });
    setIsEdit(false);
  }

  return (
    <div className="flex w-3/4 p-2">
      <form action={handleUpdateAsset} className="flex flex-1">
        <Card shadow="none" className="flex flex-1 p-4 dark:bg-card">
          <div className="flex min-w-min flex-1">
            <div className="flex flex-1 flex-row">
              <Image
                alt={mutatedAsset.name}
                src={
                  'https://www.nu-heat.co.uk/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg'
                }
                width={500}
                height={800}
                className="rounded-md object-cover"
              />
              <div className="flex flex-1 flex-col">
                <div className="ml-8 flex items-center justify-between">
                  {isEdit ? (
                    <Input
                      value={formData.name}
                      onValueChange={value =>
                        setFormData({ ...formData, name: value })
                      }
                    />
                  ) : (
                    <span className="text-3xl font-bold">
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
                          onClick={handleUpdateAsset}
                        >
                          Save
                        </Button>
                      </ButtonGroup>
                    ) : (
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
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
                          // <Controller
                          //   control={control}
                          //   name="description"
                          //   render={({ field }) => (
                          //     <Input
                          //       size="sm"
                          //       variant="faded"
                          //       {...field}
                          //       onFocus={e => {
                          //         console.log('Input field focused:', e);
                          //       }}
                          //     />
                          //   )}
                          // />
                          <Input
                            size="sm"
                            variant="faded"
                            value={formData.description}
                            onValueChange={value =>
                              setFormData({ ...formData, description: value })
                            }
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
                        <span className="font-semibold">Tag</span>
                      </TableCell>
                      <TableCell>
                        {isEdit ? (
                          <Input
                            size="sm"
                            variant="faded"
                            value={formData.tag}
                            onValueChange={value =>
                              setFormData({ ...formData, tag: value })
                            }
                          />
                        ) : (
                          <span>
                            {mutatedAsset.tag === '' ||
                            mutatedAsset.tag === null
                              ? 'No tag provided'
                              : mutatedAsset.tag}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <span className="font-semibold">Location</span>
                      </TableCell>
                      <TableCell>
                        {isEdit ? (
                          <Input
                            size="sm"
                            variant="faded"
                            value={formData.location}
                            onValueChange={value =>
                              setFormData({ ...formData, location: value })
                            }
                          />
                        ) : (
                          <span>
                            {mutatedAsset.location === null ||
                            mutatedAsset.location === ''
                              ? 'Not Specified'
                              : mutatedAsset.location}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <span className="font-semibold">Status</span>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Chip
                              size="sm"
                              variant="faded"
                              startContent={
                                <div
                                  style={{
                                    backgroundColor:
                                      mutatedAsset.status?.color ?? 'grey',
                                  }}
                                  className="mx-1 w-1 rounded-full p-1"
                                ></div>
                              }
                              className="hover:cursor-pointer"
                            >
                              {mutatedAsset.status?.title === '' ||
                              mutatedAsset.status?.title === undefined
                                ? 'Not Specified'
                                : mutatedAsset.status.title}
                            </Chip>
                          </DropdownTrigger>
                          <DropdownMenu onAction={handleStatusAction}>
                            {statusList.map(status => (
                              <DropdownItem key={status.id}>
                                <Chip
                                  size="sm"
                                  variant="faded"
                                  startContent={
                                    <div
                                      style={{
                                        backgroundColor: status.color ?? 'grey',
                                      }}
                                      className="mx-1 w-1 rounded-full p-1"
                                    ></div>
                                  }
                                  className="hover:cursor-pointer"
                                >
                                  {status.title === '' ||
                                  status.title === undefined
                                    ? 'Not Specified'
                                    : status.title}
                                </Chip>
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <span className="font-semibold">Type</span>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Chip
                              size="sm"
                              variant="faded"
                              className="hover:cursor-pointer"
                            >
                              {mutatedAsset.type?.title}
                            </Chip>
                          </DropdownTrigger>
                          <DropdownMenu onAction={handleTypeAction}>
                            {typeList.map(type => (
                              <DropdownItem key={type.id}>
                                <Chip size="sm" variant="faded">
                                  {type.title}
                                </Chip>
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
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
      </form>
    </div>
  );
}
