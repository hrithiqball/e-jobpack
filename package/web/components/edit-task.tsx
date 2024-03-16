import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { TaskType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, AlertCircle } from 'lucide-react';
import { Tooltip } from '@nextui-org/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { TaskTypeEnum } from '@/types/enum';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useTaskStore } from '@/hooks/use-task.store';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import {
  UpdateTaskDetailsForm,
  UpdateTaskDetailsFormSchema,
} from '@/lib/schemas/task';

import TaskTypeHelper from '@/components/helper/TaskTypeHelper';
import { updateTaskDetails } from '@/lib/actions/task';

type EditTaskProps = {
  checklistId?: string;
  open: boolean;
  onClose: () => void;
};

export default function EditTask({
  checklistId,
  open,
  onClose,
}: EditTaskProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();
  const router = useRouter();

  const { updateTaskInChecklist } = useMaintenanceStore();
  const { currentTask } = useTaskStore();

  const [taskTypeValue, setTaskTypeValue] = useState(currentTask?.taskType);
  const [showListChoice, setShowListChoice] = useState(false);
  const [taskListChoice, setTaskListChoice] = useState(
    currentTask?.listChoice.map(choice => ({ id: uuidv4(), value: choice })),
  );

  const form = useForm<UpdateTaskDetailsForm>({
    resolver: zodResolver(UpdateTaskDetailsFormSchema),
  });

  useEffect(() => {
    if (!currentTask) return;

    setTaskTypeValue(currentTask.taskType);
    setShowListChoice(
      currentTask.taskType === 'MULTIPLE_SELECT' ||
        currentTask.taskType === 'SINGLE_SELECT',
    );
    setTaskListChoice(
      currentTask.taskType === 'MULTIPLE_SELECT' ||
        currentTask.taskType === 'SINGLE_SELECT'
        ? currentTask.listChoice.map(choice => ({
            id: uuidv4(),
            value: choice,
          }))
        : [
            { id: uuidv4(), value: 'Choice 1' },
            { id: uuidv4(), value: 'Choice 2' },
          ],
    );
    form.setValue('taskActivity', currentTask.taskActivity);
    form.setValue('description', currentTask.description ?? '');
  }, [currentTask, form]);

  function onSubmit(data: UpdateTaskDetailsForm) {
    if (!currentTask || !taskListChoice || !taskTypeValue) {
      toast.error('Failed to update task');
      return;
    }

    if (!user || !user.id) {
      toast.error('Session expired');
      return;
    }

    if (
      taskTypeValue === 'MULTIPLE_SELECT' ||
      taskTypeValue === 'SINGLE_SELECT'
    ) {
      if (taskListChoice.length < 2) {
        toast.error('At least 2 choices are required');
        return;
      }
    }

    startTransition(() => {
      toast.promise(
        updateTaskDetails(
          currentTask.id,
          data,
          taskTypeValue,
          taskListChoice.map(choice => choice.value),
          taskTypeValue === currentTask.taskType,
        ),
        {
          loading: 'Updating task...',
          success: res => {
            if (checklistId) {
              updateTaskInChecklist(checklistId, res);
            } else {
              router.refresh();
            }
            return 'Task successfully updated!';
          },
          error: 'Failed to update task',
        },
      );

      return;
    });
  }

  function handleTaskTypeChange(taskType: string) {
    const taskTypeValue = taskType as TaskType;

    setTaskTypeValue(taskTypeValue);
    if (
      taskTypeValue === 'MULTIPLE_SELECT' ||
      taskTypeValue === 'SINGLE_SELECT'
    ) {
      setShowListChoice(true);
    } else {
      setShowListChoice(false);
    }
  }

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="update-task-mtn-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="taskActivity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Activity</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-3">
              <Label className="flex items-center space-x-2 font-semibold">
                <p>Task Type</p>
                <Tooltip
                  content="Changing in progress maintenance will clear technician input"
                  className="cursor-help"
                >
                  <AlertCircle size={16} className="cursor-help" />
                </Tooltip>
              </Label>
              <Select
                value={taskTypeValue}
                onValueChange={handleTaskTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {TaskTypeEnum.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <TaskTypeHelper size={18} taskType={type.value} />
                        <p>{type.label}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showListChoice && taskListChoice && (
              <div className="flex flex-col space-y-2">
                {taskListChoice.map(choice => (
                  <div key={choice.id} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={choice.value}
                      onChange={e => {
                        const updatedListChoice = taskListChoice.map(c => {
                          if (c.id === choice.id) {
                            return { ...c, value: e.target.value };
                          }
                          return c;
                        });
                        setTaskListChoice(updatedListChoice);
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        const updatedListChoice = taskListChoice.filter(
                          c => c.id !== choice.id,
                        );
                        setTaskListChoice(updatedListChoice);
                      }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    setTaskListChoice([
                      ...taskListChoice,
                      {
                        id: uuidv4(),
                        value: `Choice ${taskListChoice.length + 1}`,
                      },
                    ]);
                  }}
                >
                  Add Choice
                </Button>
              </div>
            )}
          </form>
        </Form>
        <SheetFooter>
          <Button
            type="submit"
            form="update-task-mtn-form"
            variant="outline"
            disabled={transitioning}
          >
            Update
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Form</DrawerTitle>
        </DrawerHeader>
        Mobile Support Coming Soon
        <DrawerFooter>
          <Button>Update</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
