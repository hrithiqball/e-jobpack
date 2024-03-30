import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import dayjs from 'dayjs';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wrapper } from '@/components/ui/wrapper';
import { Checkbox } from '@nextui-org/react';

import {
  Columns2,
  FilePlus2,
  Filter,
  MoreHorizontal,
  PenLine,
  RotateCw,
  Search,
  Wrench,
} from 'lucide-react';

import { MaintenanceItem, MaintenanceList } from '@/types/maintenance';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';

import { stopPropagation } from '@/lib/function/event';

import empty from '@/public/image/empty.gif';

import MaintenanceStatusHelper from '@/components/helper/MaintenanceStatusHelper';
import MaintenanceRecreate from './_recreate';
import MaintenanceCreate from './_create';
import MaintenancePreview from './preview';
import MaintenanceDetails from './_details';
import { baseServerUrl } from '@/public/constant/url';
import Link from 'next/link';

type MaintenanceAllTabProps = {
  maintenanceList: MaintenanceList;
};

export default function MaintenanceTab({
  maintenanceList,
}: MaintenanceAllTabProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const router = useRouter();
  const searchParams = useSearchParams();

  const details = searchParams.get('details') === 'true' || false;

  const { setMaintenance } = useMaintenanceStore();

  const [openCreateMaintenance, setOpenCreateMaintenance] = useState(false);
  const [openRecreateMaintenance, setOpenRecreateMaintenance] = useState(false);
  const [openMaintenancePreview, setOpenMaintenancePreview] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [filterBy, setFilterBy] = useState('id');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    requestedBy: false,
  });

  useEffect(() => {
    setColumnVisibility({
      startDate: isDesktop,
      deadline: isDesktop,
      approvedBy: isDesktop,
      requestedBy: false,
    });
  }, [isDesktop]);

  const columns: ColumnDef<MaintenanceItem>[] = [
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
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => {
        function handleOpenMaintenanceInfo(event: React.MouseEvent) {
          event.stopPropagation();
          setMaintenance(row.original);
          router.push('/maintenance?tab=maintenance&details=true');
        }

        // TODO: use data specific id instead of passing data
        return (
          <Link
            href="/maintenance?tab=maintenance&details=true"
            onClick={handleOpenMaintenanceInfo}
            className="text-gray-900 underline-offset-4 hover:text-blue-500 hover:underline dark:text-gray-50 dark:hover:text-blue-300"
          >
            {row.original.id}
          </Link>
        );
      },
    },
    {
      accessorKey: 'maintenanceStatus',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <MaintenanceStatusHelper
            maintenanceStatus={row.original.maintenanceStatus}
          />
        );
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => {
        return <p>{dayjs(row.original.startDate).format('DD/MM/YYYY')}</p>;
      },
    },
    {
      accessorKey: 'deadline',
      header: 'Deadline',
      cell: ({ row }) => {
        return row.original.deadline ? (
          <p>{dayjs(row.original.deadline).format('DD/MM/YYYY')}</p>
        ) : (
          <p>Not Set</p>
        );
      },
    },
    {
      accessorKey: 'requestedBy',
      header: 'Requested By',
      cell: ({ row }) => {
        return row.original.requestedBy ? (
          <div className="flex items-center space-x-2">
            {row.original.requestedBy.image ? (
              <Image
                src={`${baseServerUrl}/user/${row.original.requestedBy.image}`}
                alt={row.original.requestedBy?.name || ''}
                width={20}
                height={20}
                className="size-5 rounded-full bg-teal-800 object-contain"
              />
            ) : (
              <div className="flex size-5 items-center justify-center rounded-full bg-teal-800">
                <p className="text-xs">
                  {row.original.requestedBy?.name.substring(0, 1).toUpperCase()}
                </p>
              </div>
            )}
            <p>{row.original.requestedBy.name}</p>
          </div>
        ) : (
          <p>Not requested</p>
        );
      },
    },
    {
      accessorKey: 'approvedBy',
      header: 'Person In Charge',
      cell: ({ row }) => {
        return row.original.approvedBy ? (
          <div className="flex items-center space-x-2">
            {row.original.approvedBy.image ? (
              <Image
                src={`${baseServerUrl}/user/${row.original.approvedBy.image}`}
                alt={row.original.approvedBy.name}
                width={24}
                height={24}
                className="size-6 rounded-full bg-teal-800 object-contain"
              />
            ) : (
              <div className="flex size-6 items-center justify-center rounded-full bg-teal-800">
                <p className="text-xs text-white">
                  {row.original.approvedBy.name.substring(0, 1).toUpperCase()}
                </p>
              </div>
            )}
            <p>{row.original.approvedBy.name}</p>
          </div>
        ) : (
          <p>Not assigned</p>
        );
      },
    },
    {
      id: 'actions',
      header: () => null,
      cell: ({ row }) => {
        function handleRecreate(event: React.MouseEvent) {
          stopPropagation(event);
          setMaintenance(row.original);
          setOpenRecreateMaintenance(true);
        }

        function handleEdit(event: React.MouseEvent) {
          stopPropagation(event);
          setMaintenance(row.original);
          router.push('/maintenance?tab=maintenance&isEdit=true');
        }

        return (
          <div className="text-right">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" onClick={stopPropagation}>
                  <MoreHorizontal size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 rounded-lg p-2">
                <PopoverItem
                  onClick={handleEdit}
                  startContent={<PenLine size={18} />}
                >
                  Edit
                </PopoverItem>
                <PopoverItem
                  onClick={handleRecreate}
                  startContent={<RotateCw size={18} />}
                >
                  Recreate
                </PopoverItem>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: maintenanceList,
    columns,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getCoreRowModel: getCoreRowModel<MaintenanceItem>(),
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

  function handleOpenRowInfo(maintenance: MaintenanceItem) {
    setMaintenance(maintenance);
    setOpenMaintenancePreview(true);
  }

  function handleCreateMaintenance() {
    setOpenCreateMaintenance(true);
  }

  function handleCloseCreateMaintenance() {
    setOpenCreateMaintenance(false);
  }

  function handleCloseRecreateMaintenance() {
    setOpenRecreateMaintenance(false);
  }

  function handleCloseMaintenancePreview() {
    setOpenMaintenancePreview(false);
  }

  if (details) {
    return (
      <Wrapper>
        <MaintenanceDetails />
      </Wrapper>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      {maintenanceList.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Search
                  size={18}
                  className="relative left-7 top-2 -translate-y-1/2"
                />
                <Input
                  placeholder="Search"
                  type="search"
                  value={table.getColumn(filterBy)?.getFilterValue() as string}
                  onChange={event =>
                    table
                      .getColumn(filterBy)
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm pl-8"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Filter size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={filterBy}
                    onValueChange={setFilterBy}
                  >
                    {table
                      .getVisibleFlatColumns()
                      .filter(column => column.getCanFilter())
                      .map(column => (
                        <DropdownMenuRadioItem
                          key={column.id}
                          value={column.id}
                          className="w-full"
                        >
                          {column.id === 'id' ? (
                            'ID'
                          ) : (
                            <span>
                              {column.id
                                .replace(/([a-z])([A-Z])/g, '$1 $2')
                                .replace(/\b\w/g, c => c.toUpperCase())}
                            </span>
                          )}
                        </DropdownMenuRadioItem>
                      ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Columns2 size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {table
                    .getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={value =>
                          column.toggleVisibility(Boolean(value))
                        }
                        className="w-full"
                      >
                        {column.id === 'id' ? (
                          'ID'
                        ) : (
                          <span>
                            {column.id
                              .replace(/([a-z])([A-Z])/g, '$1 $2')
                              .replace(/\b\w/g, c => c.toUpperCase())}
                          </span>
                        )}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center space-x-1">
              {isDesktop ? (
                <Button
                  variant="outline"
                  onClick={handleCreateMaintenance}
                  className="space-x-2 px-3"
                >
                  <FilePlus2 size={18} />
                  <span>Create Maintenance</span>
                </Button>
              ) : (
                <Button variant="outline" size="icon">
                  <FilePlus2 size={18} />
                </Button>
              )}
            </div>
          </div>
          <Table aria-label="Maintenance Library Table">
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
                <TableRow
                  key={row.id}
                  onClick={() => handleOpenRowInfo(row.original)}
                  className="cursor-pointer"
                >
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
          {table.getPaginationRowModel().rows.length === 0 && (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Image priority src={empty} alt="Empty list" width={100} />
                <span className="ml-2">No maintenances</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center space-y-4">
          <Wrench size={56} className="animate-bounce" />
          <p>No maintenance created</p>
          <Button
            variant="outline"
            size="withIcon"
            onClick={handleCreateMaintenance}
          >
            <FilePlus2 size={18} />
            <span>Create Maintenance</span>
          </Button>
        </div>
      )}
      <MaintenanceCreate
        open={openCreateMaintenance}
        onClose={handleCloseCreateMaintenance}
      />
      <MaintenancePreview
        open={openMaintenancePreview}
        onClose={handleCloseMaintenancePreview}
      />
      <MaintenanceRecreate
        open={openRecreateMaintenance}
        onClose={handleCloseRecreateMaintenance}
      />
    </div>
  );
}
