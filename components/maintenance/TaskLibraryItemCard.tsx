import { Key } from 'react';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from '@nextui-org/react';
import { motion, useDragControls } from 'framer-motion';
import {
  Binary,
  Check,
  Copy,
  Dice2,
  ListChecks,
  ListTree,
  MoreVertical,
  Trash,
} from 'lucide-react';

import { TaskLibraryItem } from '@/types/task';
import { cn } from '@/lib/utils';

type TaskLibraryItemCardProps = {
  taskLib: TaskLibraryItem;
  transitioning: boolean;
  handleDragFramer: (taskLibrary: TaskLibraryItem) => void;
  setCurrentTaskLibrary: (taskLibrary: TaskLibraryItem | null) => void;
};

export default function TaskLibraryItemCard({
  taskLib,
  transitioning,
  handleDragFramer,
  setCurrentTaskLibrary,
}: TaskLibraryItemCardProps) {
  const controls = useDragControls();

  let renderComponent;

  switch (taskLib.taskType) {
    case 'CHECK':
      renderComponent = (
        <Tooltip content="Check">
          <Check size={18} />
        </Tooltip>
      );
      break;
    case 'CHOICE':
      renderComponent = (
        <Tooltip content="Choice">
          <Dice2 size={18} />
        </Tooltip>
      );
      break;
    case 'SINGLE_SELECT':
    case 'MULTIPLE_SELECT':
      renderComponent = (
        <Tooltip
          content={
            taskLib.taskType === 'SINGLE_SELECT'
              ? 'Single Selection'
              : 'Multiple Selection'
          }
        >
          <ListChecks size={18} />
        </Tooltip>
      );
      break;
    case 'NUMBER':
      renderComponent = (
        <Tooltip content="Number">
          <Binary size={18} />
        </Tooltip>
      );
      break;
  }

  function handleAction(key: Key) {
    // TODO: Implement action
    console.log(key);
  }

  return (
    <motion.div
      draggable
      dragControls={controls}
      onDragStart={() => handleDragFramer(taskLib)}
      onDragEnd={() => setCurrentTaskLibrary(null)}
      className={cn(
        'flex cursor-grab items-center justify-between rounded-md border border-solid border-gray-400 px-2 py-1 active:animate-pulse active:cursor-grabbing active:border-teal-700',
        {
          'cursor-not-allowed': transitioning,
        },
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <div>{renderComponent}</div>
          <div>{taskLib.taskActivity}</div>
        </div>
        <span className="text-sm text-gray-400">
          {taskLib.description === '' ? 'No description' : taskLib.description}
        </span>
      </div>
      <div className="flex items-center">
        {taskLib.subtaskLibrary.length > 0 && (
          <Tooltip content="Has subtasks">
            <ListTree size={18} className="mr-2" />
          </Tooltip>
        )}
        <Dropdown>
          <DropdownTrigger className="cursor-pointer">
            <MoreVertical size={18} />
          </DropdownTrigger>
          <DropdownMenu variant="faded" color="primary" onAction={handleAction}>
            <DropdownItem key="duplicate" startContent={<Copy size={18} />}>
              Duplicate
            </DropdownItem>
            <DropdownItem
              key="delete"
              color="danger"
              startContent={<Trash size={18} />}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </motion.div>
  );
}
