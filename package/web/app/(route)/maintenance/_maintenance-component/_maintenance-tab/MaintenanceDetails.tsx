import TaskTypeHelper from '@/components/helper/TaskTypeHelper';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { Divider } from '@nextui-org/react';

type MaintenanceDetailsProps = {
  open: boolean;
  onClose: () => void;
};

export default function MaintenanceDetails({
  open,
  onClose,
}: MaintenanceDetailsProps) {
  const { maintenance } = useMaintenanceStore();

  function handleClose() {
    onClose();
  }

  return (
    maintenance && (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Maintenance {maintenance.id}</SheetTitle>
          </SheetHeader>
          <div className="my-4 flex flex-col">
            {maintenance.checklist.map(checklist => (
              <div
                key={checklist.id}
                className="bg-timberwolf flex flex-col space-y-2 rounded-md px-3 py-4 dark:bg-gray-800"
              >
                <p className="mx-4 text-lg font-medium">
                  {checklist.asset.name}
                </p>
                <Divider />
                <div className="">
                  {checklist.task.map(task => (
                    <div key={task.id} className="flex flex-col px-2">
                      <div className="flex items-center space-x-2">
                        <TaskTypeHelper size={18} taskType={task.taskType} />
                        <span className="text-sm font-medium">
                          {task.taskActivity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    )
  );
}
