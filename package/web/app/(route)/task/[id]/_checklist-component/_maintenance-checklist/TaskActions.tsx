import { Fragment, Key, useState } from 'react';

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { Button } from '@/components/ui/button';

import { Edit, MoreVertical, Trash, ListTree, Library } from 'lucide-react';

import { TaskItem } from '@/types/task';

import TaskValueEdit from './TaskValueEdit';

type TaskActionsProps = {
  task: TaskItem;
  transitioning: boolean;
  handleRemoveTask: () => void;
  handleExportTask: () => void;
};

export default function TaskActions({
  task,
  transitioning,
  handleRemoveTask,
  handleExportTask,
}: TaskActionsProps) {
  const [openEditTask, setOpenEditTask] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskItem | null>(null);

  function handleAction(task: TaskItem) {
    return (key: Key) => {
      switch (key) {
        case 'edit-task':
          setCurrentTask(task);
          setOpenEditTask(true);
          break;

        case 'remove-task':
          handleRemoveTask();
          break;

        case 'add-subtask':
          break;

        case 'export-task':
          handleExportTask();
          break;
      }
    };
  }

  function handleCloseEditTask() {
    setOpenEditTask(false);
  }

  return (
    <Fragment>
      <Dropdown>
        <DropdownTrigger>
          <Button size="icon" variant="outline">
            <MoreVertical size={18} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          aria-label="Task action"
          color="primary"
          disabledKeys={
            transitioning
              ? ['edit-task', 'add-subtask', 'export-task', 'remove-task']
              : []
          }
          onAction={handleAction(task)}
        >
          <DropdownItem key="edit-task" startContent={<Edit size={18} />}>
            Edit
          </DropdownItem>
          <DropdownItem key="add-subtask" startContent={<ListTree size={18} />}>
            Add subtask
          </DropdownItem>
          <DropdownItem key="export-task" startContent={<Library size={18} />}>
            Save as library
          </DropdownItem>
          <DropdownItem
            key="remove-task"
            color="danger"
            startContent={<Trash size={18} />}
          >
            Remove Task
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {currentTask && (
        <TaskValueEdit
          task={currentTask}
          open={openEditTask}
          onClose={handleCloseEditTask}
        />
      )}
    </Fragment>
  );
}
