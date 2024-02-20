import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { TaskItem } from '@/types/task';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';

import { z } from 'zod';
const UpdateTaskFormSchema = z.object({
  taskActivity: z.string({ required_error: 'Task name is required' }),
  description: z.string().optional(),
});
type UpdateTaskForm = z.infer<typeof UpdateTaskFormSchema>;

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
  const user = useCurrentUser();

  const form = useForm<UpdateTaskForm>({
    resolver: zodResolver(UpdateTaskFormSchema),
    defaultValues: {
      taskActivity: task.taskActivity,
      description: task.description ?? '',
    },
  });

  function onSubmit(data: UpdateTaskForm) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
      }

      console.log(data);
      toast.success('Task updated');
    });
  }

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Task</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form id="update-task-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4">
              {task.taskActivity}
              {task.taskType}
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
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
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
