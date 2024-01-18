import React, {
  Fragment,
  Key,
  ReactNode,
  useState,
  useTransition,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { AssetStatus, User } from '@prisma/client';

import {
  ColumnDef,
  getCoreRowModel,
  flexRender,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
} from '@nextui-org/react';
import {
  Archive,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Columns2,
  FileBox,
  Filter,
  MoreHorizontal,
  PackageMinus,
  Search,
  Trash,
} from 'lucide-react';
import { toast } from 'sonner';

import { fetchMutatedAssetList, updateAsset } from '@/lib/actions/asset';
import { useCurrentUser } from '@/hooks/use-current-user';
import emptyIcon from '@/public/image/empty.svg';
import { useCurrentRole } from '@/hooks/use-current-role';
import AddMaintenanceModal from './AddMaintenanceModal';
import DeleteAssetModal from './DeleteAssetModal';

type MutatedAsset = Awaited<ReturnType<typeof fetchMutatedAssetList>>[0];
type Type = MutatedAsset['type'];
type Status = MutatedAsset['status'];

interface AssetTableProps {
  mutatedAssetList: MutatedAsset[];
  assetStatusList: AssetStatus[];
  userList: User[];
  children: ReactNode | null;
}

export default function AssetTable({
  mutatedAssetList,
  assetStatusList,
  userList,
  children,
}: AssetTableProps) {
  let [isPending, startTransition] = useTransition();
  const user = useCurrentUser();
  const role = useCurrentRole();

  const [assetIds, setAssetIds] = useState<string[]>([]);
  const [openAddMaintenanceModal, setOpenAddMaintenanceModal] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [filterBy, setFilterBy] = useState('name');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentAssetId, setCurrentAssetId] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    location: false,
    description: false,
    lastMaintenance: false,
    nextMaintenance: false,
    createdBy: false,
    updatedBy: false,
  });

  const columns: ColumnDef<MutatedAsset>[] = [
    {
      id: 'select',
      header: ({ table }) => {
        return (
          <Checkbox
            isSelected={
              table.getIsAllPageRowsSelected() ||
              table.getIsSomePageRowsSelected()
            }
            isIndeterminate={table.getIsSomePageRowsSelected()}
            onValueChange={value =>
              table.toggleAllPageRowsSelected(Boolean(value))
            }
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            isSelected={row.getIsSelected()}
            isIndeterminate={row.getIsSomeSelected()}
            onValueChange={value => row.toggleSelected(Boolean(value))}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <Link
            href={`/asset/${row.original.id}`}
            className="hover:text-blue-500 hover:underline"
          >
            {row.getValue('name')}
          </Link>
        );
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
    },
    {
      accessorKey: 'tag',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            Tag
          </Button>
        );
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
      cell: ({ row }) => {
        const type: Type = row.getValue('type');

        return (
          <span>
            {type?.title === '' || type?.title === undefined
              ? 'Not Specified'
              : type.title}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
      cell: ({ row }) => {
        const status: Status = row.getValue('status');

        function handleStatusChange(key: Key) {
          startTransition(() => {
            if (user === undefined || user.id === undefined) {
              toast.error('User session expired');
              return;
            }

            toast.promise(
              updateAsset(user.id, row.original.id, {
                statusId: key as string,
              }),
              {
                loading: 'Updating asset status...',
                success: res => {
                  return `${res.name} status updated successfully`;
                },
                error: 'Failed to update asset status',
              },
            );
          });
        }

        return (
          <Dropdown>
            <DropdownTrigger>
              <Chip
                size="sm"
                variant="faded"
                startContent={
                  <div
                    style={{ backgroundColor: status?.color ?? 'grey' }}
                    className="w-1 p-1 rounded-full mx-1"
                  ></div>
                }
                className="hover:cursor-pointer"
              >
                {status?.title === '' || status?.title === undefined
                  ? 'Not Specified'
                  : status.title}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu onAction={handleStatusChange}>
              {assetStatusList.map(status => (
                <DropdownItem key={status.id}>
                  <Chip
                    variant="faded"
                    startContent={
                      <div
                        style={{ backgroundColor: status.color ?? 'grey' }}
                        className="w-1 p-1 rounded-full mx-1"
                      ></div>
                    }
                    className="hover:cursor-pointer"
                  >
                    {status.title === '' || status.title === undefined
                      ? 'Not Specified'
                      : status.title}
                  </Chip>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
    {
      accessorKey: 'lastMaintenance',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
      cell: ({ row }) => {
        const lastMaintenance: string | null = row.getValue('lastMaintenance');

        return lastMaintenance === '' || lastMaintenance === null ? (
          'Not Specified'
        ) : (
          <span>{row.getValue('lastMaintenance')}</span>
        );
      },
    },
    {
      accessorKey: 'nextMaintenance',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
      cell: ({ row }) => {
        const nextMaintenance: string | null = row.getValue('nextMaintenance');

        return nextMaintenance === '' || nextMaintenance === null ? (
          'Not Specified'
        ) : (
          <span>{row.getValue('nextMaintenance')}</span>
        );
      },
    },
    {
      accessorKey: 'location',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
      cell: ({ row }) => {
        const location: string = row.getValue('location');

        return location === '' || undefined ? (
          'Not Specified'
        ) : (
          <Link href={'/asset/location'} className="flex items-center">
            <span className="mr-2">{row.getValue('location')}</span>
            <ChevronRight size={18} />
          </Link>
        );
      },
    },
    {
      accessorKey: 'personInCharge',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
      cell: ({ row }) => {
        const pic: User = row.getValue('personInCharge');

        return (
          <div className="flex items-center">
            {pic?.image !== null ||
              (pic?.image !== undefined && (
                <Avatar
                  size="sm"
                  showFallback
                  src={pic?.image ?? ''}
                  name={pic?.name}
                  className="mr-1"
                />
              ))}
            {pic?.name}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdBy',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
      cell: ({ row }) => {
        const user: User = row.getValue('createdBy');

        return (
          <div className="flex items-center">
            {user?.image !== null ||
              (user?.image !== undefined && (
                <Avatar
                  size="sm"
                  showFallback
                  src={user?.image ?? ''}
                  name={user?.name}
                />
              ))}
            {user?.name}
          </div>
        );
      },
    },
    {
      accessorKey: 'updatedBy',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="flat"
            size="sm"
            endContent={
              column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowUp size={15} />
              )
            }
            className="mb-2"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
      cell: ({ row }) => {
        const user: User = row.getValue('updatedBy');

        return (
          <div className="flex items-center">
            {user?.image !== null ||
              (user?.image !== undefined && (
                <Avatar
                  size="sm"
                  showFallback
                  src={user?.image ?? ''}
                  name={user?.name}
                />
              ))}
            {user?.name}
          </div>
        );
      },
    },
  ];

  if (role === 'ADMIN' || role === 'SUPERVISOR') {
    columns.push({
      id: 'actions',
      header: () => null,
      cell: ({ row }) => {
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="faded" size="sm" isIconOnly>
                <MoreHorizontal size={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu onAction={handleAssetAction(row.original.id)}>
              <DropdownItem
                key="archive-asset"
                variant="faded"
                startContent={<Archive size={18} />}
              >
                Archive Asset
              </DropdownItem>
              <DropdownItem
                key="delete-asset"
                variant="faded"
                color="danger"
                startContent={<PackageMinus size={18} />}
              >
                Delete Asset
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      },
      enableSorting: false,
      enableHiding: false,
    });
  }

  const table = useReactTable({
    data: mutatedAssetList,
    columns,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getCoreRowModel: getCoreRowModel<MutatedAsset>(),
    getPaginationRowModel: getPaginationRowModel<MutatedAsset>(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  function handleMe() {
    console.log(table.getSelectedRowModel().flatRows.length);

    table.getSelectedRowModel().flatRows.forEach(test => {
      console.log(test.original.id);
    });
  }

  function handleAssetAction(assetId: string) {
    return (key: Key) => {
      const asset = mutatedAssetList.find(asset => asset.id === assetId);

      if (asset === undefined) {
        toast.error('Asset not found');
        return;
      }

      setCurrentAssetId(assetId);

      switch (key) {
        case 'archive-asset':
          handleArchiveAsset(asset.id);
          break;
        case 'delete-asset':
          setOpenDeleteModal(true);
          break;
      }
    };
  }

  function handleArchiveAsset(assetId: string) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('User session expired');
        return;
      }

      if (!isPending) console.debug('archiving');

      toast.promise(updateAsset(user.id, assetId, { isArchive: true }), {
        loading: 'Archiving asset...',
        success: res => {
          return `${res.name} archived successfully`;
        },
        error: 'Failed to archive asset',
      });
    });
  }

  function handleCloseDeleteModal() {
    setOpenDeleteModal(false);
    setCurrentAssetId('');
  }

  function handleOpenAddMaintenanceModal() {
    if (user === undefined) {
      toast.error('User session expired');
      return;
    }

    let assetIds: string[] = [];

    table.getSelectedRowModel().flatRows.forEach(row => {
      assetIds.push(row.original.id);
    });

    setAssetIds(assetIds);
    setOpenAddMaintenanceModal(true);
  }

  return (
    <div className="flex flex-col flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search"
          size="sm"
          startContent={<Search size={18} />}
          value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn(filterBy)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
            <Fragment>
              <Button
                onClick={handleOpenAddMaintenanceModal}
                endContent={<FileBox size={18} />}
              >
                Create Maintenance Request
              </Button>
              <Button onClick={handleMe} endContent={<Archive size={18} />}>
                Archive Selected
              </Button>
              <Button onClick={handleMe} endContent={<Trash size={18} />}>
                Delete Selected
              </Button>
            </Fragment>
          )}
          <Dropdown>
            <DropdownTrigger>
              <Button size="md" endContent={<Filter size={18} />}>
                Filter
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              selectionMode="single"
              closeOnSelect={true}
            >
              {table
                .getVisibleFlatColumns()
                .filter(column => column.getCanFilter())
                .map(column => (
                  <DropdownItem key={column.id} className="w-full">
                    <Checkbox
                      isSelected={column.id === filterBy}
                      onValueChange={() => setFilterBy(column.id)}
                      className="w-full"
                    >
                      {column.id
                        .replace(/([a-z])([A-Z])/g, '$1 $2')
                        .replace(/\b\w/g, c => c.toUpperCase())}
                    </Checkbox>
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button size="md" endContent={<Columns2 size={18} />}>
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu disallowEmptySelection closeOnSelect={false}>
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => (
                  <DropdownItem key={column.id} className="w-full">
                    <Checkbox
                      isSelected={column.getIsVisible()}
                      onValueChange={value =>
                        column.toggleVisibility(Boolean(value))
                      }
                      className="w-full"
                    >
                      {column.id
                        .replace(/([a-z])([A-Z])/g, '$1 $2')
                        .replace(/\b\w/g, c => c.toUpperCase())}
                    </Checkbox>
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
          {children}
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <Table className="flex-1">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {table.getPaginationRowModel().rows.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Image priority src={emptyIcon} alt="Empty list" width={70} />
              <span className="ml-2">No assets found</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center space-x-1">
        <Button
          isIconOnly
          size="sm"
          variant={table.getCanPreviousPage() ? 'ghost' : 'faded'}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={18} />
        </Button>
        {table.getPageCount() !== 0 && (
          <Pagination
            color="primary"
            onChange={value => table.setPageIndex(value - 1)}
            total={table.getPageCount()}
            page={table.getState().pagination.pageIndex + 1}
          />
        )}
        <Button
          isIconOnly
          size="sm"
          variant={table.getCanNextPage() ? 'ghost' : 'faded'}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={18} />
        </Button>
      </div>
      <DeleteAssetModal
        isOpen={openDeleteModal}
        onClose={handleCloseDeleteModal}
        assetId={currentAssetId}
      />
      <AddMaintenanceModal
        isOpen={openAddMaintenanceModal}
        onClose={() => setOpenAddMaintenanceModal(false)}
        assetIds={assetIds}
        userList={userList}
      />
    </div>
  );
}
