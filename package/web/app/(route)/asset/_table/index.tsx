'use client';

import { Fragment, Key, useState, useTransition, useEffect } from 'react';
import { Asset, AssetStatus, AssetType } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

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
} from '@/components/ui/table';
import {
  Checkbox,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
} from '@nextui-org/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Archive,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Columns2,
  FilePlus2,
  Filter,
  MoreHorizontal,
  Package,
  PackageMinus,
  PackagePlus,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { AssetList, AssetItem } from '@/types/asset';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentRole } from '@/hooks/use-current-role';

import { updateAsset } from '@/data/asset.action';

import DeleteAssetModal from './delete-asset';
import AddAsset from './add-asset';
import AddMaintenanceModal from '@/components/add-maintenance';
import { baseServerUrl } from '@/public/constant/url';
import { Users } from '@/types/user';

type AssetTableProps = {
  assetList: AssetList;
  assetStatusList: AssetStatus[];
  userList: Users;
  assetTypeList: AssetType[];
};

export default function AssetTable({
  assetList,
  assetStatusList,
  userList,
  assetTypeList,
}: AssetTableProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px');
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
  const [openAddAsset, setOpenAddAsset] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    location: false,
    description: false,
    lastMaintenance: false,
    nextMaintenance: false,
    createdBy: false,
    updatedBy: false,
  });

  useEffect(() => {
    setColumnVisibility({
      lastMaintenance: false,
      nextMaintenance: false,
      description: false,
      location: false,
      createdBy: false,
      updatedBy: false,
      personInCharge: isDesktop,
      assetType: isDesktop,
      actions: isDesktop,
      assetStatus: isDesktop,
    });
  }, [isDesktop]);

  const columns: ColumnDef<AssetItem>[] = [
    {
      id: 'select',
      header: ({ table }) => {
        return (
          <div>
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
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            <Checkbox
              isSelected={row.getIsSelected()}
              isIndeterminate={row.getIsSomeSelected()}
              onValueChange={value => row.toggleSelected(Boolean(value))}
            />
          </div>
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
            variant="ghost"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={15} />
            ) : (
              <ArrowUp size={15} />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <Link
            href={`/asset/${row.original.id}?tab=details`}
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
            variant="ghost"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={15} />
            ) : (
              <ArrowUp size={15} />
            )}
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
            variant="ghost"
          >
            Tag
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={15} />
            ) : (
              <ArrowUp size={15} />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: 'assetType',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="ghost"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={15} />
            ) : (
              <ArrowUp size={15} />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const type: AssetType = row.getValue('assetType');

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
      accessorKey: 'assetStatus',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="ghost"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
          </Button>
        );
      },
      cell: ({ row }) => {
        const status: AssetStatus = row.getValue('assetStatus');

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
                success: `${row.original.name} status updated successfully`,
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
                    className="mx-1 w-1 rounded-full p-1"
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
                        className="mx-1 w-1 rounded-full p-1"
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
            variant="ghost"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={15} />
            ) : (
              <ArrowUp size={15} />
            )}
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
            variant="ghost"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={15} />
            ) : (
              <ArrowUp size={15} />
            )}
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
            variant="ghost"
          >
            {column.id
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, c => c.toUpperCase())}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={15} />
            ) : (
              <ArrowUp size={15} />
            )}
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
            variant="ghost"
          >
            Person In Charge
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={15} />
            ) : (
              <ArrowUp size={15} />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.personInCharge ? (
          <div className="flex items-center space-x-2">
            {row.original.personInCharge.image ? (
              <Image
                src={`${baseServerUrl}/user/${row.original.personInCharge.image}`}
                alt={row.original.personInCharge.name}
                width={20}
                height={20}
                quality={100}
                className="size-5 rounded-full bg-teal-950 object-contain"
              />
            ) : (
              <div className="flex size-5 items-center justify-center rounded-full bg-teal-800">
                <p className="text-xs text-white">
                  {row.original.personInCharge.name.substring(0, 1)}
                </p>
              </div>
            )}
            <span>{row.original.personInCharge.name}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>Not Assigned</span>
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
            variant="ghost"
          >
            Created By
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={15} />
            ) : (
              <ArrowUp size={15} />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            {row.original.createdBy.image ? (
              <Image
                src={`${baseServerUrl}/user/${row.original.createdBy.image}`}
                alt={row.original.createdBy.name}
                width={20}
                height={20}
                quality={100}
                className="size-5 rounded-full bg-teal-800 object-contain"
              />
            ) : (
              <div className="size-5 rounded-full bg-teal-800">
                <p className="text-xs text-white">
                  {row.original.createdBy.name.substring(0, 1)}
                </p>
              </div>
            )}
            <span>{row.original.createdBy.name}</span>
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
            variant="ghost"
            size="sm"
          >
            Updated By
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown size={15} />
            ) : (
              <ArrowUp size={15} />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            {row.original.updatedBy.image ? (
              <Image
                src={`${baseServerUrl}/user/${row.original.updatedBy.image}`}
                alt={row.original.updatedBy.name}
                width={20}
                height={20}
                quality={100}
                className="size-5 rounded-full bg-teal-800 object-contain"
              />
            ) : (
              <div className="size-5 rounded-full bg-teal-800">
                <p className="text-xs text-white">
                  {row.original.updatedBy.name.substring(0, 1)}
                </p>
              </div>
            )}
            <span>{row.original.updatedBy.name}</span>
          </div>
        );
      },
    },
  ];

  if (role !== 'TECHNICIAN') {
    columns.push({
      id: 'actions',
      header: () => null,
      meta: { align: 'right' },
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                color="primary"
                variant="light"
                disabledKeys={
                  transitioning ? ['archive-asset', 'delete-asset'] : []
                }
                onAction={handleAssetAction(row.original.id)}
              >
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
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    });
  }

  // TODO: update to this infinite scroll
  // https://tanstack.com/table/v8/docs/framework/react/examples/virtualized-infinite-scrolling
  // https://tanstack.com/virtual/v3/docs/framework/react/examples/table
  const table = useReactTable({
    data: assetList,
    columns,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getCoreRowModel: getCoreRowModel<Asset>(),
    getPaginationRowModel: getPaginationRowModel<Asset>(),
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
      const asset = assetList.find(asset => asset.id === assetId);

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

      toast.promise(updateAsset(user.id, assetId, { isArchive: true }), {
        loading: 'Archiving asset...',
        success: `${assetId} archived successfully`,
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

    const assetIds: string[] = [];

    table.getSelectedRowModel().flatRows.forEach(row => {
      assetIds.push(row.original.id);
    });

    setAssetIds(assetIds);
    setOpenAddMaintenanceModal(true);
  }

  function handleOpenAddAsset() {
    setOpenAddAsset(true);
  }

  function handleCloseAddAsset() {
    setOpenAddAsset(false);
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex flex-1 flex-col">
        {assetList.length > 0 ? (
          <div className="flex flex-1 flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Search
                    size={18}
                    className="relative left-7 top-2 -translate-y-1/2 transform"
                  />
                  <Input
                    placeholder="Search"
                    type="search"
                    value={
                      (table.getColumn(filterBy)?.getFilterValue() as string) ??
                      ''
                    }
                    onChange={event =>
                      table
                        .getColumn(filterBy)
                        ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm pl-8"
                  />
                </div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="outline" size="icon">
                      <Filter />
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
                    <Button variant="outline" size="icon">
                      <Columns2 size={18} />
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
              </div>
              <div className="flex items-center space-x-2">
                {table.getIsSomeRowsSelected() ||
                table.getIsAllRowsSelected() ? (
                  isDesktop ? (
                    <Fragment>
                      <Button
                        variant="outline"
                        onClick={handleOpenAddMaintenanceModal}
                        className="space-x-2 px-3"
                      >
                        <FilePlus2 size={18} />
                        <span>Create Maintenance</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleMe}
                        className="space-x-2 px-3"
                      >
                        <Archive size={18} />
                        <span>Archive</span>
                      </Button>
                      <Button
                        color="danger"
                        variant="destructive"
                        onClick={handleMe}
                        className="space-x-2 px-3"
                      >
                        <Trash2 size={18} />
                        <span>Delete</span>
                      </Button>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Button
                        size="icon"
                        onClick={handleOpenAddMaintenanceModal}
                      >
                        <FilePlus2 />
                      </Button>
                      <Button size="icon" onClick={handleMe}>
                        <Archive />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={handleMe}
                      >
                        <Trash2 />
                      </Button>
                    </Fragment>
                  )
                ) : (
                  role !== 'TECHNICIAN' && (
                    <Button
                      variant="outline"
                      size="withIcon"
                      onClick={handleOpenAddAsset}
                    >
                      <PackagePlus size={18} />
                      <span>Add Asset</span>
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="flex-1">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow
                      noHover
                      key={headerGroup.id}
                      className="bg-white dark:bg-gray-950"
                    >
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {table.getPaginationRowModel().rows.length === 0 && (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Package size={56} className="animate-bounce" />
                  <span className="ml-2">No assets found</span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex-1 text-sm text-gray-600">
                {`${table.getSelectedRowModel().flatRows.length} of ${table.getCoreRowModel().flatRows.length} row(s) selected.`}
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className={`${
                    table.getCanPreviousPage()
                      ? 'hover:opacity-75'
                      : 'cursor-not-allowed opacity-50'
                  } focus:outline-none`}
                >
                  <ChevronLeft size={18} />
                </Button>
                {table.getPageCount() !== 0 && (
                  <div className="flex items-center justify-center">
                    <Pagination
                      color="primary"
                      onChange={value => table.setPageIndex(value - 1)}
                      total={table.getPageCount()}
                      page={table.getState().pagination.pageIndex + 1}
                    />
                  </div>
                )}
                <Button
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className={`${
                    table.getCanNextPage()
                      ? 'hover:opacity-75'
                      : 'cursor-not-allowed opacity-50'
                  } focus:outline-none`}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
              <div className="flex-1"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex flex-1 flex-col items-center justify-center space-y-4">
              <Package size={56} className="animate-bounce" />
              <span className="ml-2">No assets found</span>
              {role !== 'TECHNICIAN' && (
                <Button variant="outline" onClick={handleOpenAddAsset}>
                  <span>Add Asset</span>
                </Button>
              )}
            </div>
          </div>
        )}
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
      <AddAsset
        open={openAddAsset}
        onClose={handleCloseAddAsset}
        assetStatusList={assetStatusList}
        assetTypeList={assetTypeList}
        userList={userList}
      />
    </div>
  );
}
