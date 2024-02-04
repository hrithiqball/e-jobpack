import { useState, useTransition } from 'react';
import Link from 'next/link';

import { Button, Divider } from '@nextui-org/react';
import { Drawer, DrawerContent, DrawerHeader } from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from '@/components/ui/sheet';
import { AlertCircle, CopyX, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { ChecklistLibraryItem, ChecklistLibraryList } from '@/types/checklist';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateChecklist } from '@/lib/actions/checklist';

import TaskTypeHelper from '@/components/helper/TaskTypeHelper';
import { UpdateChecklist } from '@/lib/schemas/checklist';

type ChecklistImportProps = {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
  checklistId: string;
  checklistLibraryList: ChecklistLibraryList;
};

export default function ChecklistImport({
  open,
  onClose,
  onUpdate,
  checklistId,
  checklistLibraryList,
}: ChecklistImportProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const [selectedChecklistLibrary, setSelectedChecklistLibrary] =
    useState<ChecklistLibraryItem | null>();

  function handleSelectChecklistLibrary(checklistLib: ChecklistLibraryItem) {
    if (selectedChecklistLibrary?.id === checklistLib.id) {
      setSelectedChecklistLibrary(null);
      return;
    }
    setSelectedChecklistLibrary(checklistLib);
  }

  function handleClose() {
    setSelectedChecklistLibrary(null);
    onClose();
  }

  function handleUpdate() {
    setSelectedChecklistLibrary(null);
    onUpdate();
    onClose();
  }

  function handleImportChecklist() {
    startTransition(() => {
      if (!user || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      if (!selectedChecklistLibrary || selectedChecklistLibrary.id === null) {
        toast.error('No checklist selected');
        return;
      }

      const updatedChecklistLibrary: UpdateChecklist = {
        updatedById: user.id,
      };

      toast.promise(
        updateChecklist(
          checklistId,
          updatedChecklistLibrary,
          selectedChecklistLibrary.id,
        ),
        {
          loading: 'Importing checklist...',
          success: () => {
            handleUpdate();
            return 'Checklist imported!';
          },
          error: 'Failed to import checklist 😥',
        },
      );
    });
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <div className="flex flex-col space-y-4">
            <span className="text-xl font-bold">
              Import Checklist From Library
            </span>
            <div className="flex flex-row space-x-4 px-4 py-2 rounded-md items-center text-small bg-red-100 text-red-700">
              <AlertCircle size={50} />
              <span>
                Importing library of an ongoing maintenance will override the
                current checklist and resets all data
              </span>
            </div>
          </div>
        </SheetHeader>
        <div className="space-y-4">
          {checklistLibraryList.map(checklistLib => (
            <div
              key={checklistLib.id}
              onClick={() => handleSelectChecklistLibrary(checklistLib)}
              className={cn(
                'flex px-4 py-2 rounded-md border border-solid border-zinc-400 w-full hover:cursor-pointer',
                {
                  'border-teal-500 bg-teal-100':
                    selectedChecklistLibrary?.id === checklistLib.id,
                },
              )}
            >
              <div className="flex flex-1 flex-col">
                <div className="flex items-center space-x-1">
                  <Link
                    href={`/maintenance?tab=checklist&details=true&checklistLibId=${checklistLib.id}`}
                    className="hover:underline hover:text-blue-500"
                  >
                    <ExternalLink size={18} />
                  </Link>
                  <span className="font-bold text-medium">
                    {checklistLib.title}
                  </span>
                </div>
                <Divider className="my-2" />
                {checklistLib.taskLibrary.length > 0 ? (
                  checklistLib.taskLibrary.map(task => (
                    <div key={task.id} className="flex flex-col px-2">
                      <div className="flex items-center">
                        <TaskTypeHelper size={18} taskType={task.taskType} />
                        <span className="text-medium font-medium">
                          {task.taskActivity}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center space-x-2">
                    <CopyX size={18} /> <span>No task recorded</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <SheetFooter>
          <Button
            size="sm"
            variant="faded"
            isDisabled={transitioning}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="faded"
            color="primary"
            isDisabled={!selectedChecklistLibrary || transitioning}
            onClick={handleImportChecklist}
          >
            Import
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader> Import Checklist From Library </DrawerHeader>
        <div className="flex flex-col flex-1">
          {checklistLibraryList.map(checklistLib => (
            <div key={checklistLib.id} className="flex flex-col">
              <span className="font-bold text-lg">{checklistLib.title}</span>
              Mobile not implemented
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}