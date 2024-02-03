import { Fragment, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { v4 as uuidv4 } from 'uuid';

import { Button, Card } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { ExternalLink, FilePlus2, ListPlus } from 'lucide-react';
import { toast } from 'sonner';

import { MaintenanceLibraryItem } from '@/types/maintenance';
import { TaskLibraryItem, TaskLibraryList } from '@/types/task';
import { useCurrentUser } from '@/hooks/use-current-user';
import {
  createTaskLibrary,
  deleteTaskLibrary,
} from '@/lib/actions/task-library';
import { CreateTaskLibrary } from '@/lib/schemas/task';
import DropArea from '@/components/maintenance/MaintenanceLibraryDropArea';
import TaskLibraryItemCard from '@/components/maintenance/TaskLibraryItemCard';
import ChecklistTaskLibraryItem from '@/components/maintenance/ChecklistTaskLibraryItem';

type MaintenanceLibraryEditProps = {
  maintenanceLibrary: MaintenanceLibraryItem;
  taskLibraryList: TaskLibraryList;
};
export default function MaintenanceLibraryEdit({
  maintenanceLibrary,
  taskLibraryList,
}: MaintenanceLibraryEditProps) {
  const [transitioning, startTransition] = useTransition();
  const router = useRouter();
  const user = useCurrentUser();

  const [currentTaskLibrary, setCurrentTaskLibrary] =
    useState<TaskLibraryItem | null>(null);

  function handleDragFramer(taskLibrary: TaskLibraryItem) {
    setCurrentTaskLibrary(taskLibrary);
  }

  function handleDrop(
    checklist: MaintenanceLibraryItem['checklistLibrary'][0],
  ) {
    if (!currentTaskLibrary) return;

    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired!');
        return;
      }

      const newTaskLibrary: CreateTaskLibrary = {
        id: uuidv4(),
        checklistLibraryId: checklist.id,
        taskActivity: currentTaskLibrary.taskActivity,
        taskType: currentTaskLibrary.taskType,
        description: currentTaskLibrary.description,
        listChoice: currentTaskLibrary.listChoice,
      };

      toast.promise(createTaskLibrary(user.id, newTaskLibrary), {
        loading: 'Adding task to checklist...',
        success: () => {
          setCurrentTaskLibrary(null);
          router.refresh();
          return `Task ${currentTaskLibrary.taskActivity} added to checklist ${checklist.title}`;
        },
        error: 'Failed to add task to checklist 🥲',
      });
    });
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
  }

  function handleDeleteTaskLibrary(taskLibrary: TaskLibraryItem) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired!');
        return;
      }

      toast.promise(deleteTaskLibrary(user.id, taskLibrary.id), {
        loading: `Deleting task ${taskLibrary.taskActivity}...`,
        success: () => {
          router.refresh();
          return `Task ${taskLibrary.taskActivity} deleted`;
        },
        error: 'Failed to delete task 🥲',
      });
    });
    toast.success(`Task ${taskLibrary.taskActivity} deleted`);
  }

  return (
    <motion.div className="flex flex-1 space-x-4">
      <Card shadow="none" className="lg:w-3/4 p-4 space-y-4">
        <div className="flex items-center justify-between ">
          <span className="font-bold text-lg">Checklist</span>
          <Button
            size="sm"
            variant="faded"
            color="primary"
            startContent={<FilePlus2 size={18} />}
          >
            Add Checklist
          </Button>
        </div>
        <div className="flex flex-1 flex-col space-y-4">
          {maintenanceLibrary.checklistLibrary.map(checklist => (
            <motion.div
              key={checklist.id}
              onDragOver={e => handleDragOver(e)}
              className="flex flex-col space-y-4 border border-solid border-gray-400 p-2 rounded-md"
            >
              <div className="flex">
                {checklist.asset ? (
                  <Link
                    href={`/asset/${checklist.asset.id}?tab=details`}
                    className="font-medium flex items-center text-medium hover:underline hover:text-blue-500 space-x-4"
                  >
                    <ExternalLink size={18} />
                    <span>Asset {checklist.asset.name}</span>
                  </Link>
                ) : (
                  <span className="font-medium text-medium">
                    {checklist.title}
                  </span>
                )}
              </div>
              {checklist.taskLibrary.length > 0 ? (
                <div className="flex flex-col">
                  {checklist.taskLibrary.map(task => (
                    <Fragment key={task.id}>
                      <ChecklistTaskLibraryItem
                        key={task.id}
                        task={task}
                        handleDelete={() => handleDeleteTaskLibrary(task)}
                      />
                      <DropArea onDrop={() => handleDrop(checklist)} />
                    </Fragment>
                  ))}
                </div>
              ) : (
                <DropArea onDrop={() => handleDrop(checklist)} />
              )}
            </motion.div>
          ))}
        </div>
      </Card>
      <Card shadow="none" className="lg:w-1/4 p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-medium font-bold">Task Library</span>
            <Button
              size="sm"
              variant="faded"
              color="primary"
              startContent={<ListPlus size={18} />}
            >
              Add New
            </Button>
          </div>
          <div className="flex flex-col space-y-1">
            {taskLibraryList.map(taskLib => (
              <TaskLibraryItemCard
                key={taskLib.id}
                taskLib={taskLib}
                transitioning={transitioning}
                handleDragFramer={handleDragFramer}
                setCurrentTaskLibrary={setCurrentTaskLibrary}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
