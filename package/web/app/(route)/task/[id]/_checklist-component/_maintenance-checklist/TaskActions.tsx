import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';

import { TaskItem } from '@/types/task';
import { Edit, MoreVertical, Trash, ListTree, Library } from 'lucide-react';
import { Key } from 'react';
import { useTaskStore } from '@/hooks/use-task.store';

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
  const { setTaskId, setTmpTask } = useTaskStore();

  function handleAction(task: TaskItem) {
    return (key: Key) => {
      switch (key) {
        case 'edit-task':
          setTmpTask({
            taskActivity: task.taskActivity,
            description: task.description,
          });
          setTaskId(task.id);
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

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
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
  );
}
