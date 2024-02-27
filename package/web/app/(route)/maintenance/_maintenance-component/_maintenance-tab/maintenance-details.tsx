import { Button } from '@/components/ui/button';
import { Table, TableCell, TableRow } from '@/components/ui/table';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { User } from '@prisma/client';
import dayjs from 'dayjs';
import {
  ClipboardX,
  FileBox,
  FilePlus2,
  FileSymlink,
  MoreVertical,
  PackageMinus,
} from 'lucide-react';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverItemDestructive,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checklist } from '@/types/maintenance';
import ChecklistAddTask from './checklist-add-task';

const baseServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

export default function MaintenanceDetails() {
  const { maintenance, setCurrentChecklist } = useMaintenanceStore();

  const [openAddChecklist, setOpenAddChecklist] = useState(false);

  function handleAddTask(checklist: Checklist) {
    console.log('Add Task', checklist.id);
    setCurrentChecklist(checklist);
    setOpenAddChecklist(true);
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

  function handleCloseAddChecklist() {
    setOpenAddChecklist(false);
  }

  return (
    maintenance && (
      <Fragment>
        <div className="flex items-center justify-between">
          <h1 className="pl-2 text-lg font-medium">{maintenance.id}</h1>
          <Button variant="ghost" size="icon">
            <MoreVertical size={18} />
          </Button>
        </div>
        <Table>
          <TableRow>
            <TableCell className="font-medium">Start Date</TableCell>
            <TableCell>
              {dayjs(maintenance.startDate).format('DD/MM/YYYY')}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Deadline</TableCell>
            <TableCell>
              {maintenance.deadline
                ? dayjs(maintenance.deadline).format('DD/MM/YYYY')
                : 'Not Specified'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Person In Charge</TableCell>
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
            className="flex flex-col rounded-md bg-white p-4 dark:bg-card"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-medium font-medium">
                {checklist.asset.name}
              </h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
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
              <div className="flex flex-col">
                {checklist.task.map(task => (
                  <div key={task.id}>{task.taskActivity}</div>
                ))}
              </div>
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
        <ChecklistAddTask
          open={openAddChecklist}
          onClose={handleCloseAddChecklist}
        />
      </Fragment>
    )
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
