import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';
import Image from 'next/image';
import dayjs from 'dayjs';

import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverItemDestructive,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Table, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import {
  ClipboardX,
  Edit,
  FileBox,
  FilePlus2,
  FileSymlink,
  Loader2,
  MoreVertical,
  PackageMinus,
  PackagePlus,
} from 'lucide-react';

import { Checklist } from '@/types/maintenance';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { cn } from '@/lib/utils';

import ChecklistAddTask from './checklist-add-task';
import MaintenanceStatusHelper from '@/components/helper/MaintenanceStatusHelper';
import DetailsTaskTable from './task-table';
import EditMaintenance from './edit-maintenance';
import AddChecklist from './add-checklist';

const baseServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

export default function MaintenanceDetails() {
  const router = useRouter();

  const { maintenance, setCurrentChecklist } = useMaintenanceStore();

  const isEditable =
    maintenance?.maintenanceStatus === 'OPENED' ||
    maintenance?.maintenanceStatus === 'REQUESTED';

  const [openAddTask, setOpenAddTask] = useState(false);
  const [openAddChecklist, setOpenAddChecklist] = useState(false);
  const [openEditMaintenance, setOpenEditMaintenance] = useState(false);

  useEffect(() => {
    if (!maintenance) router.push('/maintenance?tab=maintenance');
  }, [maintenance, router]);

  function handleAddTask(checklist: Checklist) {
    setCurrentChecklist(checklist);
    setOpenAddTask(true);
  }

  function handleOpenEditMaintenance() {
    setOpenEditMaintenance(true);
  }

  function handleOpenAddChecklist() {
    setOpenAddChecklist(true);
  }

  function handleCloseEditMaintenance() {
    setOpenEditMaintenance(false);
  }

  function handleImportChecklist(checklist: Checklist) {
    console.log('Import Checklist', checklist);
  }

  function handleExportChecklist(checklist: Checklist) {
    console.log('Export Checklist', checklist);
  }

  function handleRemoveChecklist(checklistId: string) {
    console.log('Remove Checklist', checklistId);
  }

  function handleCloseAddTask() {
    setOpenAddTask(false);
  }

  function handleCloseAddChecklist() {
    setOpenAddChecklist(false);
  }

  if (!maintenance) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <h1 className="pl-2 text-lg font-medium">{maintenance.id}</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 rounded-lg p-2">
            <PopoverItem
              onClick={handleOpenEditMaintenance}
              startContent={<Edit size={18} />}
            >
              Edit Maintenance
            </PopoverItem>
            <PopoverItem
              onClick={handleOpenAddChecklist}
              startContent={<PackagePlus size={18} />}
            >
              Add Checklist
            </PopoverItem>
          </PopoverContent>
        </Popover>
      </div>
      <Table>
        <TableRow>
          <TableCell className="font-semibold">Status</TableCell>
          <TableCell>
            <MaintenanceStatusHelper
              maintenanceStatus={maintenance.maintenanceStatus}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Start Date</TableCell>
          <TableCell>
            {dayjs(maintenance.startDate).format('DD/MM/YYYY')}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Deadline</TableCell>
          <TableCell>
            {maintenance.deadline
              ? dayjs(maintenance.deadline).format('DD/MM/YYYY')
              : 'Not Specified'}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Person In Charge</TableCell>
          <TableCell>
            {maintenance.approvedBy ? (
              <PersonInCharge personInCharge={maintenance.approvedBy} />
            ) : (
              'Not Specified'
            )}
          </TableCell>
        </TableRow>
      </Table>
      <hr />
      {maintenance.checklist.map(checklist => (
        <div
          key={checklist.id}
          className="flex flex-col space-y-4 rounded-md bg-white p-4 dark:bg-card"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-medium font-medium">{checklist.asset.name}</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!isEditable}
                  className={cn({ hidden: !isEditable })}
                >
                  <MoreVertical size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 rounded-xl p-2">
                <PopoverItem
                  onClick={() => handleAddTask(checklist)}
                  startContent={<FilePlus2 size={18} />}
                >
                  Add Task
                </PopoverItem>
                <PopoverItem
                  onClick={() => handleImportChecklist(checklist)}
                  startContent={<FileBox size={18} />}
                >
                  Import Checklist
                </PopoverItem>
                <PopoverItem
                  onClick={() => handleExportChecklist(checklist)}
                  startContent={<FileSymlink size={18} />}
                >
                  Export Checklist
                </PopoverItem>
                <PopoverItemDestructive
                  onClick={() => handleRemoveChecklist(checklist.id)}
                  startContent={<PackageMinus size={18} />}
                >
                  Remove Checklist
                </PopoverItemDestructive>
              </PopoverContent>
            </Popover>
          </div>
          {checklist.task.length > 0 ? (
            <DetailsTaskTable
              checklistId={checklist.id}
              taskList={checklist.task}
            />
          ) : (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <ClipboardX size={18} />
                <p>No Task Assigned</p>
              </div>
            </div>
          )}
        </div>
      ))}
      <EditMaintenance
        open={openEditMaintenance}
        onClose={handleCloseEditMaintenance}
      />
      <ChecklistAddTask open={openAddTask} onClose={handleCloseAddTask} />
      <AddChecklist open={openAddChecklist} onClose={handleCloseAddChecklist} />
    </Fragment>
  );
}

function PersonInCharge({ personInCharge }: { personInCharge: User }) {
  return (
    <div className="flex items-center space-x-2">
      {personInCharge.image ? (
        <Image
          src={`${baseServerUrl}/user/${personInCharge.image}`}
          alt={personInCharge.name}
          width={20}
          height={20}
          className="size-5 rounded-full"
        />
      ) : (
        <div className="size-5 rounded-full">
          <span>{personInCharge.name.substring(0, 3)}</span>
        </div>
      )}
      <p>{personInCharge.name}</p>
    </div>
  );
}
