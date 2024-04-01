import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { useTaskStore } from '@/hooks/use-task.store';
import {
  UpdateTaskIssueForm,
  UpdateTaskIssueFormSchema,
} from '@/lib/schemas/task';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type IssueDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function IssueDrawer({ open, onClose }: IssueDrawerProps) {
  const { currentTask } = useTaskStore();

  const form = useForm<UpdateTaskIssueForm>({
    resolver: zodResolver(UpdateTaskIssueFormSchema),
    defaultValues: {
      issue: currentTask?.issue || '',
    },
  });

  useEffect(() => {
    form.setValue('issue', currentTask?.issue || '');
  }, [form, currentTask]);

  function handleClose() {
    onClose();
  }

  function onSubmit(data: UpdateTaskIssueForm) {
    console.log(data);
  }

  if (!currentTask) return null;

  return (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Issue</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            id="update-task-issue"
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4"
          >
            <FormField
              control={form.control}
              name="issue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DrawerFooter>
          <Button type="submit" form="update-task-issue">
            Update
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
