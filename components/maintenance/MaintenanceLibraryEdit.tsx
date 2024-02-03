import { ChangeEvent, Fragment, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { v4 as uuidv4 } from 'uuid';

import {
  Button,
  Card,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { motion, useDragControls } from 'framer-motion';
import {
  Trash,
  Edit,
  ExternalLink,
  GripVertical,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { MaintenanceLibraryItem } from '@/types/maintenance';
import { TaskLibraryItem, TaskLibraryList } from '@/types/task';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';
import {
  createTaskLibrary,
  deleteTaskLibrary,
  updateTaskLibrary,
} from '@/lib/actions/task-library';
import { CreateTaskLibrary, UpdateTaskLibrary } from '@/lib/schemas/task';
import { TaskTypeEnum } from '@/types/enum';
import { convertToTaskTypeEnum } from '@/lib/function/convertToEnum';
import { TaskType } from '@prisma/client';

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
  const controls = useDragControls();
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
      <Card shadow="none" className="lg:w-3/4 p-4">
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
                <div className="flex flex-col space-y-2">
                  {checklist.taskLibrary.map(task => (
                    <Fragment key={task.id}>
                      <Task
                        key={task.id}
                        task={task}
                        handleDelete={() => handleDeleteTaskLibrary(task)}
                      />
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
              className={cn(
                'active:shadow-lg flex justify-center cursor-grab active:cursor-grabbing items-center border border-solid border-gray-400 rounded-md h-10 active:animate-pulse',
                {
                  'bg-red-300': transitioning,
                },
              )}
            >
              {taskLib.taskActivity}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// TODO: Move to separate file
type TaskProps = {
  task: TaskLibraryItem;
  handleDelete: () => void;
};

function Task({ task, handleDelete }: TaskProps) {
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
          <div className="flex items-center flex-1">
            {isEdit ? (
              <div className="flex items-center flex-1 space-x-4">
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
                <div className="flex items-center flex-1 space-x-2">
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
                                className="text-red-300 cursor-pointer"
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
                  <span>{task.taskActivity}</span>
                  <span className="text-xs text-gray-500">
                    {task.description === ''
                      ? 'No description'
                      : task.description}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={18} />
                  <span>{taskType}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {isHovered && !isEdit && (
          <div className="flex items-center space-x-2">
            <div className="hover:text-yellow-300 hover:cursor-pointer">
              <Edit size={18} onClick={() => setIsEdit(true)} />
            </div>
            <div className="hover:text-red-300 hover:cursor-pointer">
              <Trash size={18} onClick={handleDelete} />
            </div>
          </div>
        )}
        {isEdit && (
          <div className="flex items-center space-x-2">
            <div className="hover:text-green-300 hover:cursor-pointer">
              <Check size={18} onClick={handleSave} />
            </div>
            <div className="hover:text-red-300 hover:cursor-pointer">
              <X size={18} onClick={handleCancel} />
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
