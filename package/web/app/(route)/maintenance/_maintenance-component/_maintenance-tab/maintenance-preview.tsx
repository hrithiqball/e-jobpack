import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { useMaintenanceStore } from '@/hooks/use-maintenance.store';

import TaskTypeHelper from '@/components/helper/TaskTypeHelper';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

type MaintenancePreviewProps = {
  open: boolean;
  onClose: () => void;
};

export default function MaintenancePreview({
  open,
  onClose,
}: MaintenancePreviewProps) {
  const { maintenance } = useMaintenanceStore();

  function handleClose() {
    onClose();
  }

  return (
    maintenance && (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent>
          <SheetHeader className="space-y-4">
            <SheetTitle>
              <Link
                href="/maintenance/?tab=maintenance&details=true"
                className="flex items-center space-x-2 hover:text-blue-500 hover:underline"
              >
                <ExternalLink size={18} />
                <span>Maintenance {maintenance.id}</span>
              </Link>
            </SheetTitle>
            <hr />
          </SheetHeader>
          <div className="my-4 flex flex-col space-y-4">
            {maintenance.checklist.map(checklist => (
              <div
                key={checklist.id}
                className="flex flex-col space-y-2 rounded-md bg-timberwolf px-3 py-4 dark:bg-gray-800"
              >
                <p className="mx-4 text-medium font-medium">
                  {checklist.asset.name}
                </p>
                <hr />
                <div>
                  {checklist.task.length > 0 ? (
                    checklist.task.map(task => (
                      <div key={task.id} className="flex flex-col px-2">
                        <div className="flex items-center space-x-2">
                          <TaskTypeHelper size={18} taskType={task.taskType} />
                          <span className="text-sm font-medium">
                            {task.taskActivity}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center">No task found</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    )
  );
}
