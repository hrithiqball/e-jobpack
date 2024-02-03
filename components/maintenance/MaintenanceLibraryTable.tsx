import { Fragment, Key, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

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
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';

import {
  MaintenanceLibraryList,
  MaintenanceLibraryItem,
} from '@/types/maintenance';
import emptyIcon from '@/public/image/empty.svg';
import MaintenanceLibraryInfo from '@/components/maintenance/MaintenanceLibraryInfo';
import { Copy, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

type MaintenanceLibraryTableProps = {
  maintenanceLibraryList: MaintenanceLibraryList;
};

export default function MaintenanceLibraryTable({
  maintenanceLibraryList,
}: MaintenanceLibraryTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [openMaintenanceLibraryInfo, setOpenMaintenanceLibraryInfo] =
    useState(false);
  const [currentMaintenanceLibrary, setCurrentMaintenanceLibrary] = useState<
    MaintenanceLibraryItem | undefined
  >();

  const columns: ColumnDef<MaintenanceLibraryItem>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'description', header: 'Description' },
    {
      id: 'actions',
      header: () => null,
      meta: { align: 'right' },
      cell: ({ row }) => {
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
                onAction={handleMaintenanceLibraryAction(row.original.id)}
              >
                <DropdownItem key="duplicate" startContent={<Copy size={18} />}>
                  Duplicate
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  color="danger"
                  startContent={<Trash size={18} />}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: maintenanceLibraryList,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel<MaintenanceLibraryItem>(),
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

  function handleMaintenanceLibraryAction(maintenanceLibraryId: string) {
    return (key: Key) => {
      const maintenanceLibraryItem = maintenanceLibraryList.find(
        mtn => mtn.id === maintenanceLibraryId,
      );

      if (!maintenanceLibraryItem) {
        toast.error('Maintenance library not found');
        return;
      }

      switch (key) {
        case 'delete':
          toast.error('Delete action not implemented');
          break;
      }
    };
  }

  return maintenanceLibraryList.length > 0 ? (
    <Fragment>
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
      {currentMaintenanceLibrary && (
        <MaintenanceLibraryInfo
          maintenanceLibrary={currentMaintenanceLibrary}
          open={openMaintenanceLibraryInfo}
          onClose={handleCloseMaintenanceLibraryInfo}
          handleEdit={handleEditLibraryRoute}
        />
      )}
    </Fragment>
  ) : (
    <div className="flex flex-1 flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center space-y-4">
        <Image priority src={emptyIcon} alt="Empty list" width={70} />
        <span className="font-medium text-md">
          No library yet. Time to create one?
        </span>
        <Button
          size="sm"
          variant="faded"
          color="primary"
          onClick={handleCreateLibraryRoute}
        >
          Create Library
        </Button>
      </div>
    </div>
  );
}
