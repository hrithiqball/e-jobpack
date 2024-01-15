import React, { Fragment, Key, useState } from 'react';

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
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from '@nextui-org/react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { fetchMutatedAssetList } from '@/lib/actions/asset';
import { useRouter } from 'next/navigation';

type MutatedAsset = Awaited<ReturnType<typeof fetchMutatedAssetList>>[0];
type Type = MutatedAsset['type'];

const columns: ColumnDef<MutatedAsset>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
          size="sm"
          endContent={<ArrowUpDown size={18} />}
        >
          Name
        </Button>
      );
    },
  },
  {
    accessorKey: 'tag',
    header: 'Tag',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'type',
    header: 'Type',
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
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'person-in-charge',
    header: 'Person In Charge',
  },
];

interface AssetTableProps {
  handleRowAction: (key: Key) => void;
  mutatedAssetList: Awaited<ReturnType<typeof fetchMutatedAssetList>>;
}

export default function AssetTable({
  handleRowAction,
  mutatedAssetList,
}: AssetTableProps) {
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: mutatedAssetList,
    columns,
    getCoreRowModel: getCoreRowModel<MutatedAsset>(),
    getPaginationRowModel: getPaginationRowModel<MutatedAsset>(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  function handleRowNavigate(id: string) {
    router.push(`/asset/${id}`);
  }

  return (
    <Fragment>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="faded" size="sm">
              <MoreHorizontal size={18} />
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
                    {column.id}
                  </Checkbox>
                </DropdownItem>
              ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <Table>
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
            <TableRow
              key={row.id}
              onClick={() => handleRowNavigate(row.original.id)}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="faded"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="faded"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </Fragment>
  );
}
