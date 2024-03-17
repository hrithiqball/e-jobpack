import { Fragment, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  FileBox,
  FilePlus2,
  ImagePlus,
  LibraryBig,
  MoreVertical,
  PackageCheck,
  PackageMinus,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverItem,
  PopoverItemDestructive,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { Maintenance } from '@/types/maintenance';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { deleteChecklist, updateChecklist } from '@/data/checklist.action';

import AddTask from './add-task';
import ChecklistExport from './export';
import ChecklistImport from './import';

type AssetActionsProps = {
  checklist: Maintenance['checklist'][0];
};

export default function ChecklistActions({ checklist }: AssetActionsProps) {
  const [transitioning, startTransition] = useTransition();
  const router = useRouter();
  const role = useCurrentRole();
  const user = useCurrentUser();

  const [openAddTask, setOpenAddTask] = useState(false);
  const [openImportChecklist, setOpenImportChecklist] = useState(false);
  const [openExportChecklist, setExportChecklist] = useState(false);

  function handleCloseTaskAddModal() {
    setOpenAddTask(false);
  }

  function handleCloseChecklistExportModal() {
    setExportChecklist(false);
  }

  function handleCloseChecklistImport() {
    setOpenImportChecklist(false);
  }

  function handleCloseChecklist() {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      toast.promise(
        updateChecklist(checklist.id, {
          updatedById: user.id,
          isClose: true,
        }),
        {
          loading: 'Closing checklist...',
          success: res => {
            return `${res.assetId} is closed!`;
          },
          error: 'Failed to close checklist 😥',
        },
      );
      if (!transitioning) {
        console.log('success');
      }
    });
  }

  function handleRemoveChecklist() {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      toast.promise(deleteChecklist(checklist.id), {
        loading: 'Removing checklist...',
        success: () => {
          return 'Checklist removed!';
        },
        error: 'Failed to remove checklist 😥',
      });
    });
  }

  function handleChecklistUpdate() {
    setOpenImportChecklist(false);
    router.refresh();
  }

  function handleOpenAddTask() {
    setOpenAddTask(true);
  }

  function handleOpenChecklistImport() {
    setOpenImportChecklist(true);
  }

  function handleOpenSaveAsLibrary() {
    setExportChecklist(true);
  }

  return (
    <Fragment>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreVertical size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56 rounded-lg p-2">
          <PopoverItem startContent={<ImagePlus size={18} />}>
            Add Attachment
          </PopoverItem>
          {role !== 'TECHNICIAN' && (
            <Fragment>
              <PopoverItem
                onClick={handleOpenAddTask}
                startContent={<FilePlus2 size={18} />}
              >
                Add Task
              </PopoverItem>
              <PopoverItem
                onClick={handleOpenChecklistImport}
                startContent={<FileBox size={18} />}
              >
                Import Checklist
              </PopoverItem>
              <PopoverItem
                onClick={handleOpenSaveAsLibrary}
                startContent={<LibraryBig size={18} />}
              >
                Save As Library
              </PopoverItem>
            </Fragment>
          )}
          <PopoverItem
            onClick={handleCloseChecklist}
            startContent={<PackageCheck size={18} />}
          >
            Mark As Close
          </PopoverItem>
          {role !== 'TECHNICIAN' && (
            <PopoverItemDestructive
              onClick={handleRemoveChecklist}
              startContent={<PackageMinus size={18} />}
            >
              Remove Checklist
            </PopoverItemDestructive>
          )}
        </PopoverContent>
      </Popover>
      <AddTask
        open={openAddTask}
        onClose={handleCloseTaskAddModal}
        checklist={checklist}
      />
      <ChecklistExport
        open={openExportChecklist}
        onClose={handleCloseChecklistExportModal}
        checklist={checklist}
      />
      <ChecklistImport
        open={openImportChecklist}
        onClose={handleCloseChecklistImport}
        onUpdate={handleChecklistUpdate}
        checklistId={checklist.id}
      />
    </Fragment>
  );
}
