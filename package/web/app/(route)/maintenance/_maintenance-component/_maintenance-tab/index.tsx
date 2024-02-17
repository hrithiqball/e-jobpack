import { Key, useState } from 'react';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from '@nextui-org/react';
import {
  FilePlus2,
  Filter,
  MoreHorizontal,
  RotateCw,
  Search,
} from 'lucide-react';

import { MaintenanceItem, MaintenanceList } from '@/types/maintenance';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import MaintenanceCreate from './_maintenance-create';
import MaintenanceRecreate from './_maintenance-recreate';

type MaintenanceAllTabProps = {
  maintenanceList: MaintenanceList;
};

export default function MaintenanceAllTab({
  maintenanceList,
}: MaintenanceAllTabProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [searchInput, setSearchInput] = useState('');
  const [openCreateMaintenance, setOpenCreateMaintenance] = useState(false);
  const [openRecreateMaintenance, setOpenRecreateMaintenance] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<MaintenanceItem>();

  const columns: ColumnDef<MaintenanceItem>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'maintenanceStatus', header: 'Status' },
    {
      id: 'actions',
      header: () => null,
      cell: ({ row }) => {
        function handleAction(key: Key) {
          switch (key) {
            case 'recreate':
              handleRecreate();
              break;
          }
        }

        function handleRecreate() {
          setSelectedMaintenance(row.original);
          setOpenRecreateMaintenance(true);
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
                onAction={handleAction}
              >
                <DropdownItem
                  key="recreate"
                  startContent={<RotateCw size={18} />}
                >
                  Recreate
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: maintenanceList,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel<MaintenanceItem>(),
  });

  function handleOpenRowInfo(maintenance: MaintenanceItem) {
    console.log('Open Maintenance Info', maintenance);
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

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            size="sm"
            variant="faded"
            color="primary"
            placeholder="Search"
            value={searchInput}
            onValueChange={setSearchInput}
            startContent={<Search size={18} />}
          />
          <div></div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="faded" startContent={<Filter size={18} />}>
            Filter
          </Button>
          <Button
            isIconOnly={!isDesktop}
            variant="faded"
            color="primary"
            startContent={isDesktop ? <FilePlus2 size={18} /> : null}
            onClick={handleCreateMaintenance}
          >
            {isDesktop ? 'Create' : <FilePlus2 size={18} />}
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
      {selectedMaintenance && (
        <MaintenanceRecreate
          open={openRecreateMaintenance}
          onClose={handleCloseRecreateMaintenance}
          maintenance={selectedMaintenance}
        />
      )}
    </div>
  );
}
