import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
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
  UpdateUserDetailsForm,
  UpdateUserDetailsSchema,
} from '@/lib/schemas/user';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useDepartmentTypeStore } from '@/hooks/use-department-type.store';
import { Loader } from '@/components/ui/loader';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { updateUserDetails } from '@/data/user.action';
import { User } from '@/types/user';

type EditUserProps = {
  open: boolean;
  onClose: () => void;
  user: User;
};

export default function EditUser({ user, open, onClose }: EditUserProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { departmentTypes } = useDepartmentTypeStore();

  const form = useForm<UpdateUserDetailsForm>({
    resolver: zodResolver(UpdateUserDetailsSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      departmentId: user?.departmentId || '',
    },
  });

  function onSubmit(data: UpdateUserDetailsForm) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired!');
        return;
      }

      toast.promise(updateUserDetails(user.id, data), {
        loading: 'Updating user details...',
        success: 'Details updated',
        error: 'Failed to update user details',
      });
    });
  }

  function handleClose() {
    onClose();
  }

  if (!departmentTypes) return <Loader />;

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Details</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="update-user-detail-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
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
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departmentTypes.map(department => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter>
          <Button
            type="submit"
            form="update-user-detail-form"
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
          <DrawerTitle>Add Types</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="outline">Add</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
