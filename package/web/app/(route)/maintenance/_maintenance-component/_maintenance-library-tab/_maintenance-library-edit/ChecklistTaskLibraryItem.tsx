import { ChangeEvent, useState, useTransition } from 'react';
import { TaskType } from '@prisma/client';
import { useRouter } from 'next/navigation';

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Tooltip,
} from '@nextui-org/react';
import {
  Binary,
  Check,
  Dice2,
  Edit,
  GripVertical,
  ListChecks,
  Trash,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { TaskTypeEnum } from '@/types/enum';
import { TaskLibraryItem } from '@/types/task';

import { useCurrentUser } from '@/hooks/use-current-user';

import { updateTaskLibrary } from '@/lib/actions/task-library';
import { convertToTaskTypeEnum } from '@/lib/function/convertToEnum';
import { UpdateTaskLibrary } from '@/lib/schemas/task';

type ChecklistTaskLibraryItemProps = {
  task: TaskLibraryItem;
  handleDelete: () => void;
};

export default function ChecklistTaskLibraryItem({
  task,
  handleDelete,
}: ChecklistTaskLibraryItemProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();
  const router = useRouter();

  const taskTypeEnum = convertToTaskTypeEnum(task.taskType);

  const [isHovered, setIsHovered] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [taskType, setTaskType] = useState(taskTypeEnum.label);
  const [tempTaskTypeValue, setTempTaskTypeValue] = useState(task.taskType);
  const [tempTaskActivity, setTempTaskActivity] = useState(task.taskActivity);
  const [tempTaskDescription, setTempTaskDescription] = useState(
    task.description ?? '',
  );
  const [tempListChoice, setTempListChoice] = useState(task.listChoice);

  let renderComponent;

  switch (task.taskType) {
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
            task.taskType === 'SINGLE_SELECT'
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

  function handleSave() {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired!');
        return;
      }

      const updatedTaskLibrary: UpdateTaskLibrary = {
        taskActivity: tempTaskActivity,
        description: tempTaskDescription === '' ? null : tempTaskDescription,
        taskType: tempTaskTypeValue,
        listChoice: tempListChoice,
      };
      toast.promise(updateTaskLibrary(user.id, task.id, updatedTaskLibrary), {
        loading: 'Saving task...',
        success: () => {
          router.refresh();
          return `Task ${tempTaskActivity} saved`;
        },
        error: 'Failed to save task 🥲',
      });
    });

    toast.success('Task saved!');
    setIsEdit(false);
  }

  function handleCancel() {
    toast.error('Task edit cancelled');
    setIsEdit(true);
  }

  function handleTaskTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    const taskType = TaskTypeEnum.find(
      tt => tt.label === e.target.value,
    )!.value;

    setTempTaskTypeValue(taskType);
    setTaskType(e.target.value);

    if (tempListChoice.length > 0) return;

    setTempListChoice(['First Choice', 'Second Choice']);

    toast.success(tempListChoice.length);
  }

  function handleAddChoice() {
    setTempListChoice([...tempListChoice, 'First Choice']);
  }

  return (
    <div
      key={task.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-1 items-center space-x-4">
          <div className="flex flex-1 items-center">
            {isEdit ? (
              <div className="flex flex-1 items-center space-x-4">
                <Input
                  isRequired
                  size="sm"
                  variant="faded"
                  color="primary"
                  label="Task activity"
                  errorMessage={
                    tempTaskActivity === '' && 'Task activity is required'
                  }
                  isInvalid={tempTaskActivity === ''}
                  value={tempTaskActivity}
                  onValueChange={setTempTaskActivity}
                  className="flex-1"
                />
                <Input
                  size="sm"
                  variant="faded"
                  color="primary"
                  label="Description"
                  value={tempTaskDescription}
                  onValueChange={setTempTaskDescription}
                  className="flex-1"
                />
                <div className="flex flex-1 items-center space-x-2">
                  <Select
                    variant="faded"
                    size="sm"
                    color="primary"
                    isDisabled={transitioning}
                    selectedKeys={[taskType]}
                    onChange={handleTaskTypeChange}
                    className="flex-1"
                  >
                    {TaskTypeEnum.map(taskType => (
                      <SelectItem
                        color="primary"
                        variant="faded"
                        key={taskType.label}
                        value={taskType.value}
                      >
                        {taskType.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {(tempTaskTypeValue === TaskType.MULTIPLE_SELECT ||
                    tempTaskTypeValue === TaskType.SINGLE_SELECT) && (
                    <Popover placement="bottom">
                      <PopoverTrigger>
                        <Button radius="sm" variant="faded" color="primary">
                          List Choice
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            variant="faded"
                            color="primary"
                            onClick={handleAddChoice}
                          >
                            Add choice
                          </Button>
                          {tempListChoice.map((lc, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <Input
                                size="sm"
                                variant="faded"
                                color="primary"
                                value={tempListChoice[index]}
                                onValueChange={lc => {
                                  const newTempListChoice = [...tempListChoice];
                                  newTempListChoice[index] = lc;
                                  setTempListChoice(newTempListChoice);
                                }}
                              />
                              <span
                                className="cursor-pointer text-red-300"
                                onClick={() => {
                                  setTempListChoice(
                                    tempListChoice.filter(
                                      (_, i) => i !== index,
                                    ),
                                  );
                                }}
                              >
                                <Trash size={18} />
                              </span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <GripVertical color="#6b7280" className="cursor-grab" />
                <div className="flex flex-col">
                  <div className="flex items-center space-x-4">
                    <div>{renderComponent}</div>
                    <span className="text-medium">{task.taskActivity}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {task.description === ''
                      ? 'No description'
                      : task.description}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        {isHovered && !isEdit && (
          <div className="flex items-center space-x-2">
            <div className="hover:cursor-pointer hover:text-yellow-300">
              <Edit size={18} onClick={() => setIsEdit(true)} />
            </div>
            <div className="hover:cursor-pointer hover:text-red-300">
              <Trash size={18} onClick={handleDelete} />
            </div>
          </div>
        )}
        {isEdit && (
          <div className="flex items-center space-x-2">
            <div className="hover:cursor-pointer hover:text-green-300">
              <Check size={18} onClick={handleSave} />
            </div>
            <div className="hover:cursor-pointer hover:text-red-300">
              <X size={18} onClick={handleCancel} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
