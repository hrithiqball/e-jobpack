import { Fragment } from 'react';
import Link from 'next/link';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';

import { Button, Divider } from '@nextui-org/react';
import { Edit, ExternalLink } from 'lucide-react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { MaintenanceLibraryItem } from '@/types/maintenance';
import { cn } from '@/lib/utils';
import TaskTypeHelper from '@/components/helper/TaskTypeHelper';

type MaintenanceLibraryInfoProps = {
  maintenanceLibrary: MaintenanceLibraryItem;
  open: boolean;
  onClose: () => void;
  handleEdit: (libraryId: string) => void;
};

export default function MaintenanceLibraryInfo({
  open,
  onClose,
  maintenanceLibrary,
  handleEdit,
}: MaintenanceLibraryInfoProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop ? (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <div className="flex justify-between">
            <span className="text-xl font-bold text-teal-800">
              {maintenanceLibrary.title}
            </span>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="primary"
              onClick={() => handleEdit(maintenanceLibrary.id)}
            >
              <Edit size={18} />
            </Button>
          </div>
        </SheetHeader>
        <div className="flex flex-1 flex-col space-y-4">
          {maintenanceLibrary.checklistLibrary.map(checklist => (
            <div
              key={checklist.id}
              className={cn(
                'flex flex-col rounded-md border border-solid border-zinc-400 p-4',
                {
                  'space-y-4': checklist.taskLibrary.length > 0,
                },
              )}
            >
              {checklist.assetId ? (
                <div className="flex items-center space-x-2 hover:cursor-pointer hover:text-blue-500 hover:underline">
                  <ExternalLink size={18} />
                  <Link
                    href={`/asset/${checklist.assetId}`}
                    className="text-medium font-medium"
                  >
                    {checklist.title}
                  </Link>
                </div>
              ) : (
                <span className="text-medium font-medium">
                  {checklist.title}
                </span>
              )}
              <div className="space-y-2">
                {checklist.taskLibrary.map((task, index) => (
                  <Fragment key={task.id}>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <div className="cursor-help">
                          <TaskTypeHelper size={18} taskType={task.taskType} />
                        </div>
                        <span className="font-medium">{task.taskActivity}</span>
                      </div>
                      <span className="text-sm text-zinc-500">
                        {task.description === ''
                          ? 'No description'
                          : task.description}
                      </span>
                    </div>
                    {index < checklist.taskLibrary.length - 1 && <Divider />}
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>{maintenanceLibrary.title}</DrawerHeader>
        <DrawerFooter>
          <button onClick={onClose}>close</button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
