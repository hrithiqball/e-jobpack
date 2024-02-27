import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { selectionChoices } from '@/public/utils/task-type-options';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskType } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Trash } from 'lucide-react';

const AddTaskFormSchema = z.object({
  taskActivity: z
    .string({ required_error: 'Task activity is required' })
    .min(1, { message: 'Task activity is required' }),
  description: z.string().optional(),
  taskType: z.nativeEnum(TaskType).optional(),
});

type AddTaskForm = z.infer<typeof AddTaskFormSchema>;

type ChecklistAddTaskProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChecklistAddTask({
  open,
  onClose,
}: ChecklistAddTaskProps) {
  const { maintenance, currentChecklist } = useMaintenanceStore();

  const [showListChoice, setShowListChoice] = useState(false);
  const [listChoice, setListChoice] = useState([
    { id: uuidv4(), value: 'Choice 1' },
    { id: uuidv4(), value: 'Choice 2' },
  ]);

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

    if (
      (data.taskType === 'MULTIPLE_SELECT' ||
        data.taskType === 'SINGLE_SELECT') &&
      listChoice.length < 2
    ) {
      toast.error('At least 2 choices are required');
      return;
    }

    console.log(currentChecklist.id);
    console.log(data);
  }

  function handleTaskTypeChange(event: string) {
    const taskType = event as TaskType;
    setShowListChoice(
      taskType === 'MULTIPLE_SELECT' || taskType === 'SINGLE_SELECT',
    );
  }

  function handleClose() {
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
              <FormField
                control={form.control}
                name="taskType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Type</FormLabel>
                    <Select
                      onValueChange={val => {
                        handleTaskTypeChange(val);
                        field.onChange();
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="space-x-4">
                        {selectionChoices.map(choice => (
                          <SelectItem key={choice.key} value={choice.key}>
                            {choice.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
