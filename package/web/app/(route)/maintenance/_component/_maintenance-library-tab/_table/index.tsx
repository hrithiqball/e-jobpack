import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverItemDestructive,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@nextui-org/react';

import {
  Columns2,
  Copy,
  FilePen,
  Filter,
  LibraryBig,
  MoreHorizontal,
  Package,
  Search,
  Trash,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import {
  MaintenanceLibraryList,
  MaintenanceLibraryItem,
} from '@/types/maintenance';

import { useMediaQuery } from '@/hooks/use-media-query';

import { stopPropagation } from '@/lib/function/event';

import emptyIcon from '@/public/image/empty.svg';

import MaintenanceLibraryInfo from './library-info';

const baseServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

type MaintenanceLibraryTableProps = {
  maintenanceLibraryList: MaintenanceLibraryList;
};

export default function MaintenanceLibraryTable({
  maintenanceLibraryList,
}: MaintenanceLibraryTableProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const router = useRouter();
  const pathname = usePathname();

  const [filterBy, setFilterBy] = useState('title');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [openMaintenanceLibraryInfo, setOpenMaintenanceLibraryInfo] =
    useState(false);
  const [currentMaintenanceLibrary, setCurrentMaintenanceLibrary] = useState<
    MaintenanceLibraryItem | undefined
  >();

  useEffect(() => {
    setColumnVisibility({
      description: isDesktop,
      createdBy: isDesktop,
      updatedBy: isDesktop,
    });
  }, [isDesktop]);

  const containerMotion = {
    rest: {},
    hover: {},
  };

  const childMotion = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.3, rotate: 20 },
  };

  const columns: ColumnDef<MaintenanceLibraryItem>[] = [
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
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => {
        const user: User = row.original.createdBy;
        const initials = user.name.substring(0, 3);

        return (
          <div className="flex items-center space-x-2">
            {user.image ? (
              <Image
                src={`${baseServerUrl}/user/${user.image}`}
                alt={user.name}
                width={28}
                height={28}
                className="size-7 rounded-full"
              />
            ) : (
              <div className="flex size-7 items-center justify-center rounded-full bg-gray-500 text-xs">
                {initials}
              </div>
            )}
            <p>{user.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'updatedBy',
      header: 'Updated By',
      cell: ({ row }) => {
        const user: User = row.original.createdBy;
        const initials = user.name.substring(0, 3);

        return (
          <div className="flex items-center space-x-2">
            {user.image ? (
              <Image
                src={`${baseServerUrl}/user/${user.image}`}
                alt={user.name}
                width={28}
                height={28}
                className="size-7 rounded-full"
              />
            ) : (
              <div className="flex size-7 items-center justify-center rounded-full bg-gray-500 text-xs">
                {initials}
              </div>
            )}
            <p>{user.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'checklistLibrary',
      header: 'Asset Count',
      cell: ({ row }) => {
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <motion.div
                animate="rest"
                whileHover="hover"
                variants={containerMotion}
                className="group flex items-center space-x-2"
              >
                <motion.span
                  variants={childMotion}
                  className="group-hover:text-blue-500"
                >
                  <Package size={18} />
                </motion.span>
                <span>{row.original.checklistLibrary.length}</span>
              </motion.div>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex flex-col">
                {row.original.checklistLibrary.map(checklist => (
                  <div key={checklist.id}>
                    <Link href={`/asset/${checklist.assetId}`}>
                      <div className="flex justify-between">
                        <span className="hover:text-blue-500 hover:underline">
                          {checklist.asset?.name}
                        </span>
                        <span>{checklist.taskLibrary.length} tasks</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      id: 'actions',
      header: () => null,
      meta: { align: 'right' },
      cell: ({ row }) => {
        const maintenanceLibraryItem = maintenanceLibraryList.find(
          mtn => mtn.id === row.original.id,
        );

        function handleDuplicate() {
          toast.info('Duplicate action coming soon');
        }

        function handleEdit(event: React.MouseEvent) {
          event.stopPropagation();
          if (!maintenanceLibraryItem) {
            toast.error('Maintenance library not found');
            return;
          }

          router.push(
            `${pathname}?tab=library&isEdit=true&libraryId=${maintenanceLibraryItem.id}`,
          );
        }

        function handleDelete() {
          toast.error('Delete action not implemented');
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
                  startContent={<FilePen size={18} />}
                >
                  Edit
                </PopoverItem>
                <PopoverItem
                  onClick={handleDuplicate}
                  startContent={<Copy size={18} />}
                >
                  Duplicate
                </PopoverItem>
                <PopoverItemDestructive
                  onClick={handleDelete}
                  startContent={<Trash size={18} />}
                >
                  Delete
                </PopoverItemDestructive>
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
    data: maintenanceLibraryList,
    columns,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getCoreRowModel: getCoreRowModel<MaintenanceLibraryItem>(),
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

  function handleCreateLibraryRoute() {
    router.push(`${pathname}?tab=library&create=true`);
  }

  function handleOpenRowInfo(maintenanceLibrary: MaintenanceLibraryItem) {
    setCurrentMaintenanceLibrary(maintenanceLibrary);
    setOpenMaintenanceLibraryInfo(true);
  }

  function handleEditLibraryRoute(libraryId: string) {
    router.push(`${pathname}?tab=library&isEdit=true&libraryId=${libraryId}`);
    setOpenMaintenanceLibraryInfo(false);
  }

  function handleCloseMaintenanceLibraryInfo() {
    setOpenMaintenanceLibraryInfo(false);
  }

  return maintenanceLibraryList.length > 0 ? (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Search
              size={18}
              className="relative left-7 top-2 -translate-y-2"
            />
            <Input
              placeholder="Search"
              type="search"
              aria-label="Search maintenance library"
              value={table.getColumn(filterBy)?.getFilterValue() as string}
              onChange={event =>
                table.getColumn(filterBy)?.setFilterValue(event.target.value)
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
                      {column.id
                        .replace(/([a-z])([A-Z])/g, '$1 $2')
                        .replace(/\bw/g, c => c.toUpperCase())}
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
              onClick={handleCreateLibraryRoute}
              className="space-x-2 px-3"
            >
              <LibraryBig size={18} />
              <span>Create Maintenance Library</span>
            </Button>
          ) : (
            <Button variant="outline" size="icon">
              <LibraryBig size={18} />
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
      {table.getPaginationRowModel().rows.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Image priority src={emptyIcon} alt="Empty list" width={70} />
            <span className="ml-2">No assets found</span>
          </div>
        </div>
      )}
      {currentMaintenanceLibrary && (
        <MaintenanceLibraryInfo
          maintenanceLibrary={currentMaintenanceLibrary}
          open={openMaintenanceLibraryInfo}
          onClose={handleCloseMaintenanceLibraryInfo}
          handleEdit={handleEditLibraryRoute}
        />
      )}
    </div>
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Image priority src={emptyIcon} alt="Empty list" width={70} />
        <span className="text-md font-medium">
          No library yet. Time to create one?
        </span>
        <Button size="sm" onClick={handleCreateLibraryRoute}>
          Create Library
        </Button>
      </div>
    </div>
  );
}
