import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
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
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { updateDepartmentType } from '@/data/department-type.action';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useDepartmentTypeStore } from '@/hooks/use-department-type.store';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  UpdateDepartmentTypeFormSchema,
  UpdateDepartmentTypeFormType,
} from '@/lib/schemas/department-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type DepartmentType = {
  open: boolean;
  onClose: () => void;
};

export default function EditDepartment({ open, onClose }: DepartmentType) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const { departmentType } = useDepartmentTypeStore();

  const form = useForm<UpdateDepartmentTypeFormType>({
    resolver: zodResolver(UpdateDepartmentTypeFormSchema),
    defaultValues: {
      value: departmentType?.value || '',
    },
  });

  useEffect(() => {
    if (!departmentType) return;

    form.setValue('value', departmentType.value);
  }, [form, departmentType]);

  function onSubmit(data: UpdateDepartmentTypeFormType) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      if (!departmentType) {
        toast.error('Department type not found');
        return;
      }

      toast.promise(updateDepartmentType(user.id, departmentType.id, data), {
        loading: 'Updating department type...',
        success: 'Department type updated',
        error: 'Failed to update department type',
      });
    });
  }

  function handleClose() {
    onClose();
  }

  if (!departmentType) {
    return null;
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit {departmentType.value}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="update-department-type"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter>
          <Button
            type="submit"
            form="update-department-type"
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit</SheetTitle>
        </SheetHeader>
        <SheetFooter>
          <Button variant="outline">Update</Button>
        </SheetFooter>
      </SheetContent>
    </Drawer>
  );
}
