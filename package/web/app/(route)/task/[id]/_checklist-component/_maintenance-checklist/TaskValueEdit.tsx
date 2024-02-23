import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { TaskType } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import { TaskItem } from '@/types/task';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';

import { UpdateTask, UpdateTaskSchema } from '@/lib/schemas/task';
import { updateTask } from '@/lib/actions/task';

import { selectionChoices } from '@/public/utils/task-type-options';

type TaskValueEditProps = {
  task: TaskItem;
  open: boolean;
  onClose: () => void;
};

export default function TaskValueEdit({
  task,
  open,
  onClose,
}: TaskValueEditProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px');
  const router = useRouter();
  const user = useCurrentUser();

  const [taskType, setTaskType] = useState(task.taskType);
  const [listChoice, setListChoice] = useState<
    { key: string; value: string }[]
  >(
    task.listChoice.length < 2
      ? [
          { key: uuidv4(), value: 'Choice 1' },
          { key: uuidv4(), value: 'Choice 2' },
        ]
      : task.listChoice.map(choice => ({
          key: uuidv4(),
          value: choice,
        })),
  );

  const form = useForm<UpdateTask>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      taskActivity: task.taskActivity + ' ',
      description: task.description || '  ',
      taskType: task.taskType,
    },
  });

  function onSubmit(data: UpdateTask) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      const dataListChoice =
        taskType === 'MULTIPLE_SELECT' || taskType === 'SINGLE_SELECT'
          ? listChoice.map(choice => choice.value)
          : [];

      if (
        data.taskActivity === task.taskActivity &&
        data.description === task.description &&
        data.taskType === task.taskType &&
        JSON.stringify(dataListChoice) === JSON.stringify(task.listChoice)
      ) {
        handleClose();
        return;
      }

      const updatedTask: UpdateTask = {
        ...data,
        listChoice:
          data.taskType === 'MULTIPLE_SELECT' ||
          data.taskType === 'SINGLE_SELECT'
            ? listChoice.map(choice => choice.value)
            : [],
      };

      const validatedFields = UpdateTaskSchema.safeParse(updatedTask);

      if (!validatedFields.success) {
        toast.error(validatedFields.error?.issues[0]?.message);
        return;
      }

      toast.promise(updateTask(task.id, user.id, validatedFields.data), {
        loading: 'Updating task...',
        success: () => {
          router.refresh();
          onClose();
          return 'Task updated';
        },
        error: 'Failed to update task',
      });
    });
  }

  function handleAddChoice() {
    const prevLength = listChoice.length + 1;

    setListChoice(prevChoices => [
      ...prevChoices,
      { key: uuidv4(), value: `Choice ${prevLength}` },
    ]);
  }

  function handleDeleteChoice(id: string) {
    setListChoice(prevChoices =>
      prevChoices.filter(choice => choice.key !== id),
    );
  }

  function handleChoiceChange(id: string, value: string) {
    setListChoice(prevChoices =>
      prevChoices.map(choice => {
        if (choice.key === id) {
          return { ...choice, value };
        }
        return choice;
      }),
    );
  }

  function handleClose() {
    form.reset();
    onClose();
  }

  return isDesktop ? (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Task</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <Form {...form}>
            <form id="update-task-form" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="taskActivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <sup className="text-red-500">*</sup>
                      </FormLabel>
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
                        <Input
                          type="text"
                          placeholder="Enter details of task here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taskType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type <sup className="text-red-500">*</sup>
                      </FormLabel>
                      <Select
                        onValueChange={value => {
                          field.onChange(value);
                          setTaskType(value as TaskType);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Task Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectionChoices.map(choice => (
                            <SelectItem key={choice.key} value={choice.key}>
                              {choice.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {(taskType === 'MULTIPLE_SELECT' ||
                  taskType === 'SINGLE_SELECT') && (
                  <div className="space-y-2">
                    <Label>List Choice</Label>
                    {listChoice.map(choice => (
                      <div
                        key={choice.key}
                        className="flex items-center space-x-4"
                      >
                        <Input
                          value={choice.value}
                          onChange={e =>
                            handleChoiceChange(choice.key, e.target.value)
                          }
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteChoice(choice.key)}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" onClick={handleAddChoice}>
                      Add Choice
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <Button
            type="submit"
            form="update-task-form"
            variant="outline"
            size="sm"
            disabled={transitioning}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Task</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col">Mobile coming soon</div>
      </DrawerContent>
    </Drawer>
  );
}
