import { useTransition, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Checkbox } from '@nextui-org/react';
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
import { motion } from 'framer-motion';
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
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { ChecklistLibraryItem, ChecklistLibraryList } from '@/types/checklist';
import { useCurrentUser } from '@/hooks/use-current-user';
import { deleteChecklistLibrary } from '@/lib/actions/checklist-library';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
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
import { stopPropagation } from '@/lib/function/stopPropagation';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import TaskTypeHelper from '@/components/helper/TaskTypeHelper';
import { useMediaQuery } from '@/hooks/use-media-query';

const baseServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

type ChecklistLibraryTableProps = {
  checklistLibraryList: ChecklistLibraryList;
};

export default function ChecklistLibraryTable({
  checklistLibraryList,
}: ChecklistLibraryTableProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();
  const router = useRouter();

  const [filterBy, setFilterBy] = useState('title');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const containerMotion = {
    rest: {},
    hover: {},
  };

  const childMotion = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.3, rotate: 20 },
  };

  const columns: ColumnDef<ChecklistLibraryItem>[] = [
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
        return (
          <div className="flex items-center space-x-2">
            {row.original.createdBy.image ? (
              <Image
                src={`${baseServerUrl}/user/${row.original.createdBy.image}`}
                alt={row.original.createdBy.name}
                width={28}
                height={28}
                className="size-7 rounded-full"
              />
            ) : (
              <div className="flex size-7 items-center justify-center rounded-full bg-gray-500 text-xs">
                {row.original.createdBy.name.substring(0, 3)}
              </div>
            )}
            <p>{row.original.createdBy.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'updatedBy',
      header: 'Updated By',
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            {row.original.createdBy.image ? (
              <Image
                src={`${baseServerUrl}/user/${row.original.createdBy.image}`}
                alt={row.original.createdBy.name}
                width={28}
                height={28}
                className="size-7 rounded-full"
              />
            ) : (
              <div className="flex size-7 items-center justify-center rounded-full bg-gray-500 text-xs">
                {row.original.createdBy.name.substring(0, 3)}
              </div>
            )}
            <p>{row.original.createdBy.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'asset',
      header: 'Asset',
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Link href={`/asset/${row.original.assetId}`}>
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
                <span className="group-hover:text-blue-500 group-hover:underline">
                  {row.original.asset?.name}
                </span>
              </motion.div>
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: 'taskLibrary',
      header: 'Task Count',
      cell: ({ row }) => {
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
              <span>{row.original.taskLibrary.length}</span>
            </motion.div>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex flex-col">
              {row.original.taskLibrary.map(task => (
                <div key={task.id} className="flex flex-col px-2">
                  <div className="flex items-center space-x-2">
                    <TaskTypeHelper size={18} taskType={task.taskType} />
                    <span className="text-sm font-medium">
                      {task.taskActivity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>;
      },
    },
    {
      id: 'actions',
      header: () => null,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        function handleDelete() {
          startTransition(() => {
            if (!user || user.id === undefined) {
              toast.error('Session expired!');
              return;
            }

            toast.promise(deleteChecklistLibrary(user.id, row.original.id), {
              loading: 'Deleting library...',
              success: res => {
                router.refresh();
                return `Library ${res.title} deleted!`;
              },
              error: 'Failed to delete library! 🥲',
            });
          });
        }

        function handleEdit() {
          router.push(
            `/maintenance?tab=checklist&checklistLibId=${row.original.id}&details=true`,
          );
        }

        function handleDuplicate() {
          toast.info('Duplicate library feature coming soon!');
        }

        return (
          <div className="text-right">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={transitioning}
                  onClick={stopPropagation}
                >
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
    },
  ];

  const table = useReactTable({
    data: checklistLibraryList,
    columns,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getCoreRowModel: getCoreRowModel<ChecklistLibraryItem>(),
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
    router.push('/maintenance?tab=checklist&isCreate=true');
  }

  return (
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
              aria-label="Search checklist library"
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
              <span>Create Checklist Library</span>
            </Button>
          ) : (
            <Button variant="outline" size="icon">
              <LibraryBig size={18} />
            </Button>
          )}
        </div>
      </div>
      <Table aria-label="Checklist Library Table">
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
