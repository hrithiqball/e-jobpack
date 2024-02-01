import { Fragment, useState } from 'react';
import Link from 'next/link';

import { Card } from '@nextui-org/react';
import { motion, useDragControls } from 'framer-motion';
import { toast } from 'sonner';

import { MaintenanceLibraryItem } from '@/types/maintenance';
import { TaskLibraryItem, TaskLibraryList } from '@/types/task';
import { Trash, Edit, ExternalLink, GripVertical } from 'lucide-react';

type MaintenanceLibraryEditProps = {
  maintenanceLibrary: MaintenanceLibraryItem;
  taskLibraryList: TaskLibraryList;
};
export default function MaintenanceLibraryEdit({
  maintenanceLibrary,
  taskLibraryList,
}: MaintenanceLibraryEditProps) {
  const controls = useDragControls();

  const [currentTaskLibrary, setCurrentTaskLibrary] =
    useState<TaskLibraryItem | null>(null);

  function handleDragFramer(taskLibrary: TaskLibraryItem) {
    setCurrentTaskLibrary(taskLibrary);
  }

  function handleDrop(
    checklist: MaintenanceLibraryItem['checklistLibrary'][0],
  ) {
    if (!currentTaskLibrary) return;

    toast.success(
      `Task ${currentTaskLibrary.taskActivity} added to checklist ${checklist.title}`,
    );
    setCurrentTaskLibrary(null);
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
  }

  return (
    <motion.div className="flex flex-1 space-x-4">
      <Card shadow="none" className="lg:w-3/4 p-4">
        <div className="flex flex-1 flex-col">
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
                      <Task key={task.id} task={task} />
                      <DropArea onDrop={() => handleDrop(checklist)} />
                    </Fragment>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  No tasks / Droppable zone
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
      <Card shadow="none" className="lg:w-1/4 p-4">
        <div className="flex flex-col space-y-1">
          {taskLibraryList.map(taskLib => (
            <motion.div
              draggable
              key={taskLib.id}
              dragControls={controls}
              onDragStart={() => handleDragFramer(taskLib)}
              onDragEnd={() => setCurrentTaskLibrary(null)}
              className="active:shadow-lg flex justify-center cursor-grab active:cursor-grabbing items-center border border-solid border-gray-400 rounded-md h-10 active:animate-pulse"
            >
              {taskLib.taskActivity}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

function Task({ task }: { task: TaskLibraryItem }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      key={task.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <GripVertical size={18} color="#6b7280" className="cursor-grab" />
          <span>{task.taskActivity}</span>
        </div>
        {isHovered && (
          <div className="flex items-center space-x-2">
            <div className="hover:text-yellow-300 hover:cursor-pointer">
              <Edit size={18} />
            </div>
            <div className="hover:text-red-300 hover:cursor-pointer">
              <Trash size={18} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DropArea({ onDrop }: { onDrop: () => void }) {
  return (
    <div
      onDrop={onDrop}
      className="flex justify-center items-center border border-solid border-gray-400 rounded-md h-10"
    >
      Drop here
    </div>
  );
}
