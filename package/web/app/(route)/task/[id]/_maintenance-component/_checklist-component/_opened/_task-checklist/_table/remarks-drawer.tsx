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
  UpdateTaskRemarksForm,
  UpdateTaskRemarksFormSchema,
} from '@/lib/schemas/task';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type RemarksDrawerProps = {
  open: boolean;
  onClose: () => void;
};
export default function RemarksDrawer({ open, onClose }: RemarksDrawerProps) {
  const { currentTask } = useTaskStore();

  const form = useForm<UpdateTaskRemarksForm>({
    resolver: zodResolver(UpdateTaskRemarksFormSchema),
    defaultValues: {
      remarks: currentTask?.remarks || '',
    },
  });

  useEffect(() => {
    form.setValue('remarks', currentTask?.remarks || '');
  }, [form, currentTask]);

  function handleClose() {
    onClose();
  }

  function onSubmit(data: UpdateTaskRemarksForm) {
    console.log(data);
  }

  if (!currentTask) return null;

  return (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Remarks</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            id="update-task-remarks"
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4"
          >
            <FormField
              control={form.control}
              name="remarks"
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
          <Button type="submit" form="update-task-remarks">
            Update
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
