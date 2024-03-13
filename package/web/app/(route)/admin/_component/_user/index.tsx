import { User } from '@prisma/client';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Columns2, Filter, Search, UserPlus } from 'lucide-react';
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
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import emptyIcon from '@/public/image/empty.svg';
import { useUserStore } from '@/hooks/use-user.store';
import UserPreview from './user-preview';
import { isNullOrEmpty } from '@/lib/function/string';
import { convertToTitleCase } from '@/lib/function/convertToWord';
import CreateUser from './create-user';

type UserTabProps = {
  userList: User[];
};

export default function UserTab({ userList }: UserTabProps) {
  const { setCurrentUser } = useUserStore();

  const data = userList.filter(user => user.id !== '-99');

  const [openUserPreview, setOpenUserPreview] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [filterBy, setFilterBy] = useState('name');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return <p>{row.original.name}</p>;
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        if (!row.original.role) return <p>-</p>;

        const role = convertToTitleCase(row.original.role);
        return <p>{role}</p>;
      },
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => {
        if (!row.original.department) return <p>-</p>;

        const department = convertToTitleCase(row.original.department);
        return <p>{department}</p>;
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => {
        return <p>{isNullOrEmpty(row.original.phone) || '-'}</p>;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getCoreRowModel: getCoreRowModel<User>(),
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

  function handleOpenUserPreview(user: User) {
    setCurrentUser(user);
    setOpenUserPreview(true);
  }

  function handleOpenCreateUser() {
    setOpenCreateUser(true);
  }

  function handleCloseUserPreview() {
    setOpenUserPreview(false);
  }

  function handleCloseCreateUser() {
    setOpenCreateUser(false);
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Search
            size={18}
            className="relative left-7 top-2 -translate-y-1/2"
          />
          {/* https://tanstack.com/table/v8/docs/framework/react/examples/filters */}
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
        <Button
          variant="outline"
          size="withIcon"
          onClick={handleOpenCreateUser}
        >
          <UserPlus size={18} />
          <p>Create User</p>
        </Button>
      </div>
      <div className="flex flex-1">
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
                onClick={() => handleOpenUserPreview(row.original)}
                className="cursor-pointer"
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
      </div>
      <UserPreview open={openUserPreview} onClose={handleCloseUserPreview} />
      <CreateUser open={openCreateUser} onClose={handleCloseCreateUser} />
    </div>
  );
}
