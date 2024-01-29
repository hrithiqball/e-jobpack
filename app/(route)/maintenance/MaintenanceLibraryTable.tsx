import { Fragment, useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

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
} from '@/components/ui/Table';
import { Button } from '@nextui-org/react';

import {
  MaintenanceLibraryList,
  MaintenanceLibraryItem,
} from '@/types/maintenance';
import emptyIcon from '@/public/image/empty.svg';
import MaintenanceLibraryInfo from '@/app/(route)/maintenance/MaintenanceLibraryInfo';

interface MaintenanceLibraryTableProps {
  maintenanceLibraryList: MaintenanceLibraryList;
}

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

  function handleCloseMaintenanceLibraryInfo() {
    setOpenMaintenanceLibraryInfo(false);
  }

  function handleOpenRowInfo(maintenanceLibrary: MaintenanceLibraryItem) {
    setCurrentMaintenanceLibrary(maintenanceLibrary);
    setOpenMaintenanceLibraryInfo(true);
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
          open={openMaintenanceLibraryInfo}
          onClose={handleCloseMaintenanceLibraryInfo}
          maintenanceLibrary={currentMaintenanceLibrary}
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
