import { Fragment, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverItemDestructive,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import {
  ClipboardX,
  Edit,
  FileBox,
  FilePlus2,
  FileSymlink,
  FileX2,
  Loader2,
  MoreVertical,
  PackageMinus,
  PackagePlus,
} from 'lucide-react';

import { Checklist } from '@/types/maintenance';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { cn } from '@/lib/utils';

import ChecklistAddTask from './checklist-add-task';
import DetailsTaskTable from './task-table';
import EditMaintenance from './edit-maintenance';
import AddChecklist from '@/components/helper/add-checklist';
import ExportMaintenance from './export-maintenance';
import { toast } from 'sonner';
import { deleteChecklist } from '@/data/checklist.action';
import { useCurrentRole } from '@/hooks/use-current-role';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCurrentUser } from '@/hooks/use-current-user';
import { deleteMaintenance } from '@/data/maintenance.action';
import InfoTable from '../../../../../../components/helper/info-table';

export default function MaintenanceDetails() {
  const [transitioning, startTransition] = useTransition();
  const router = useRouter();
  const role = useCurrentRole();
  const user = useCurrentUser();

  const { maintenance, setCurrentChecklist, removeChecklistFromMaintenance } =
    useMaintenanceStore();

  const isEditable =
    maintenance?.maintenanceStatus === 'OPENED' ||
    maintenance?.maintenanceStatus === 'REQUESTED';

  const [openAddTask, setOpenAddTask] = useState(false);
  const [openAddChecklist, setOpenAddChecklist] = useState(false);
  const [openEditMaintenance, setOpenEditMaintenance] = useState(false);
  const [openExportMaintenance, setOpenExportMaintenance] = useState(false);

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

  function handleOpenExportMaintenance() {
    setOpenExportMaintenance(true);
  }

  function handleCloseExportMaintenance() {
    setOpenExportMaintenance(false);
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
    startTransition(() => {
      toast.promise(deleteChecklist(checklistId), {
        loading: 'Removing checklist...',
        success: () => {
          removeChecklistFromMaintenance(checklistId);
          return 'Checklist removed';
        },
        error: 'Failed to remove checklist',
      });
    });
  }

  function handleCloseAddTask() {
    setOpenAddTask(false);
  }

  function handleCloseAddChecklist() {
    setOpenAddChecklist(false);
  }

  function handleDelete() {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      if (!maintenance) {
        toast.error('Maintenance not found');
        return;
      }

      toast.promise(deleteMaintenance(maintenance.id, user.id), {
        loading: 'Deleting maintenance...',
        success: () => {
          router.push('/maintenance?tab=maintenance');
          router.refresh();
          return 'Maintenance deleted';
        },
        error: 'Failed to delete maintenance',
      });
    });
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
            <PopoverItem
              onClick={handleOpenExportMaintenance}
              startContent={<FileSymlink size={18} />}
            >
              Export Maintenance
            </PopoverItem>
            {role !== 'TECHNICIAN' && (
              <AlertDialog>
                <AlertDialogTrigger>
                  <PopoverItemDestructive startContent={<FileX2 size={18} />}>
                    Delete Maintenance
                  </PopoverItemDestructive>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      maintenance and all its data!
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </PopoverContent>
        </Popover>
      </div>
      <InfoTable />
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
                  disabled={!isEditable || transitioning}
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
      <AddChecklist
        open={openAddChecklist}
        onClose={handleCloseAddChecklist}
        assets={maintenance.checklist.map(c => c.assetId)}
      />
      <ExportMaintenance
        open={openExportMaintenance}
        onClose={handleCloseExportMaintenance}
      />
    </Fragment>
  );
}
