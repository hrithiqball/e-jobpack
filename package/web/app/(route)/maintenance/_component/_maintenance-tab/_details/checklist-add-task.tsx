import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TaskType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import { selectionChoices } from '@/public/utils/task-type-options';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { AddTaskForm, AddTaskFormSchema, CreateTask } from '@/lib/schemas/task';
import { createTask } from '@/data/task.action';
import { cn } from '@/lib/utils';

type ChecklistAddTaskProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChecklistAddTask({
  open,
  onClose,
}: ChecklistAddTaskProps) {
  const router = useRouter();

  const { maintenance, currentChecklist, addTaskToChecklist } =
    useMaintenanceStore();

  const [showListChoice, setShowListChoice] = useState(false);
  const [listChoice, setListChoice] = useState([
    { id: uuidv4(), value: 'Choice 1' },
    { id: uuidv4(), value: 'Choice 2' },
  ]);
  const [taskType, setTaskType] = useState('');
  const [taskTypeError, setTaskTypeError] = useState(false);

  const form = useForm<AddTaskForm>({
    resolver: zodResolver(AddTaskFormSchema),
  });

  function onSubmit(data: AddTaskForm) {
    if (!maintenance) {
      toast.error('Maintenance not found');
      return;
    }

    if (!currentChecklist) {
      toast.error('Checklist not found');
      return;
    }

    if (!taskType) {
      setTaskTypeError(true);
      return;
    }

    if (
      (taskType === 'MULTIPLE_SELECT' || taskType === 'SINGLE_SELECT') &&
      listChoice.length < 2
    ) {
      toast.error('At least 2 choices are required');
      return;
    }

    const newTask: CreateTask = {
      checklistId: currentChecklist.id,
      listChoice: listChoice.map(c => c.value),
      ...data,
    };

    toast.promise(createTask(newTask, taskType as TaskType), {
      loading: 'Adding task...',
      success: res => {
        router.refresh();
        const mappedTask = { ...res, subtask: [], taskAssignee: [] };
        addTaskToChecklist(currentChecklist.id, mappedTask);
        handleClose();
        return 'Task successfully added';
      },
      error: 'Failed to add task',
    });
  }

  function handleTaskTypeChange(choice: string) {
    const taskType = choice as TaskType;
    setTaskType(taskType);
    setTaskTypeError(false);
    setShowListChoice(
      taskType === 'MULTIPLE_SELECT' || taskType === 'SINGLE_SELECT',
    );
  }

  function handleClose() {
    form.reset();
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Add Task</SheetTitle>
        </SheetHeader>
        <hr />
        <Form {...form}>
          <form id="add-task-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4">
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
              <Label
                className={cn('font-semibold', {
                  'text-red-500': taskTypeError,
                })}
              >
                Task Type
              </Label>
              <Select value={taskType} onValueChange={handleTaskTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {selectionChoices.map(choice => (
                    <SelectItem key={choice.key} value={choice.key}>
                      {choice.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {taskTypeError && (
                <p className="text-sm font-medium text-red-500">
                  Task type is required
                </p>
              )}
              {showListChoice && (
                <div className="flex flex-col space-y-2">
                  {listChoice.map(choice => (
                    <div
                      key={choice.id}
                      className="flex items-center space-x-2"
                    >
                      <Input
                        type="text"
                        value={choice.value}
                        onChange={e => {
                          const updatedListChoice = listChoice.map(c => {
                            if (c.id === choice.id) {
                              return { ...c, value: e.target.value };
                            }
                            return c;
                          });
                          setListChoice(updatedListChoice);
                        }}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                          const updatedListChoice = listChoice.filter(
                            c => c.id !== choice.id,
                          );
                          setListChoice(updatedListChoice);
                        }}
                      >
                        <Trash size={18} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      setListChoice([
                        ...listChoice,
                        {
                          id: uuidv4(),
                          value: `Choice ${listChoice.length + 1}`,
                        },
                      ]);
                    }}
                  >
                    Add Choice
                  </Button>
                  {listChoice.length < 2 && (
                    <div className="text-sm text-red-500">
                      At least 2 choices are required
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </Form>
        <SheetFooter>
          <Button variant="outline" type="submit" form="add-task-form">
            Add
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
