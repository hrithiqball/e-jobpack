import { useState } from 'react';

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
import {
  Columns2,
  FilePlus2,
  Filter,
  MoreHorizontal,
  RotateCw,
  Search,
} from 'lucide-react';

import { MaintenanceItem, MaintenanceList } from '@/types/maintenance';

import MaintenanceCreate from './_maintenance-create';
import MaintenanceRecreate from './_maintenance-recreate';
import MaintenanceStatusHelper from '@/components/helper/MaintenanceStatusHelper';
import { Checkbox } from '@nextui-org/react';
import MaintenanceDetails from './MaintenanceDetails';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';

type MaintenanceAllTabProps = {
  maintenanceList: MaintenanceList;
};

export default function MaintenanceAllTab({
  maintenanceList,
}: MaintenanceAllTabProps) {
  const { setMaintenance } = useMaintenanceStore();

  const [openCreateMaintenance, setOpenCreateMaintenance] = useState(false);
  const [openRecreateMaintenance, setOpenRecreateMaintenance] = useState(false);
  const [openMaintenanceDetails, setOpenMaintenanceDetails] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [filterBy, setFilterBy] = useState('id');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    location: false,
    description: false,
    lastMaintenance: false,
    nextMaintenance: false,
    createdBy: false,
    updatedBy: false,
  });

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
    { accessorKey: 'id', header: 'ID' },
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
      id: 'actions',
      header: () => null,
      cell: ({ row }) => {
        function handleRecreate() {
          setMaintenance(row.original);
          setOpenRecreateMaintenance(true);
        }

        return (
          <div className="text-right">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 rounded-lg p-2">
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
    console.log('Open Maintenance Info', maintenance);
    setMaintenance(maintenance);
    setOpenMaintenanceDetails(true);
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

  function handleCloseMaintenanceDetails() {
    setOpenMaintenanceDetails(false);
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
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
                table.getColumn(filterBy)?.setFilterValue(event.target.value)
              }
              className="max-w-sm pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon">
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
              <Button size="icon">
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
          <Button onClick={handleCreateMaintenance} className="space-x-2 px-3">
            <FilePlus2 size={18} />
            <span>Create Maintenance</span>
          </Button>
        </div>
      </div>
      <Table aria-label="Maintenance Library Table">
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} noHover>
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
              className="hover:cursor-pointer"
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <MaintenanceCreate
        open={openCreateMaintenance}
        onClose={handleCloseCreateMaintenance}
      />
      <MaintenanceDetails
        open={openMaintenanceDetails}
        onClose={handleCloseMaintenanceDetails}
      />
      <MaintenanceRecreate
        open={openRecreateMaintenance}
        onClose={handleCloseRecreateMaintenance}
      />
    </div>
  );
}
