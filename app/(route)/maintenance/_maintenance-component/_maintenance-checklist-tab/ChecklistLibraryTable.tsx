import { Key, useTransition } from 'react';
import Link from 'next/link';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { Copy, FilePen, MoreHorizontal, Package, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { ChecklistLibraryItem, ChecklistLibraryList } from '@/types/checklist';
import { useCurrentUser } from '@/hooks/use-current-user';
import { deleteChecklistLibrary } from '@/lib/actions/checklist-library';
import { useRouter } from 'next/navigation';

type ChecklistLibraryTableProps = {
  checklistLibraryList: ChecklistLibraryList;
};

export default function ChecklistLibraryTable({
  checklistLibraryList,
}: ChecklistLibraryTableProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();
  const router = useRouter();

  const columns: ColumnDef<ChecklistLibraryItem>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'asset',
      header: 'Asset',
      cell: ({ row }) => {
        const asset: ChecklistLibraryItem['asset'] = row.getValue('asset');

        return (
          <div className="flex items-center space-x-2">
            <Link href={`/asset/${asset?.id}`}>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="cursor-pointer hover:text-blue-500"
              >
                <Package size={18} />
              </motion.div>
            </Link>
            <span>{asset?.name}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => null,
      size: 50,
      minSize: 50,
      maxSize: 50,
      cell: ({ row }) => {
        function handleAction(key: Key) {
          switch (key) {
            case 'delete':
              handleDelete(row.original.id);
              break;
            case 'duplicate':
              toast.info('Feature coming soon!');
              break;
            case 'edit':
              router.push(
                `/maintenance?tab=checklist&checklistLibId=${row.original.id}&details=true`,
              );
              break;
          }
        }

        function handleDelete(id: string) {
          startTransition(() => {
            if (!user || user.id === undefined) {
              toast.error('Session expired!');
              return;
            }

            toast.promise(deleteChecklistLibrary(user.id, id), {
              loading: 'Deleting library...',
              success: res => {
                router.refresh();
                return `Library ${res.title} deleted!`;
              },
              error: 'Failed to delete library! 🥲',
            });
          });
        }

        return (
          <div className="text-right">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light" size="sm">
                  <MoreHorizontal size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                variant="faded"
                color="primary"
                disabledKeys={
                  transitioning ? ['delete', 'duplicate', 'edit'] : []
                }
                onAction={handleAction}
              >
                <DropdownItem key="edit" startContent={<FilePen size={18} />}>
                  Edit
                </DropdownItem>
                <DropdownItem key="duplicate" startContent={<Copy size={18} />}>
                  Duplicate
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  color="danger"
                  startContent={<Trash size={18} />}
                >
                  Delete Library
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: checklistLibraryList,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel<ChecklistLibraryItem>(),
  });

  return (
    <Table aria-label="Checklist Library Table">
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
  );
}
