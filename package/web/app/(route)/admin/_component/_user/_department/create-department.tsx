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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { createDepartmentType } from '@/data/department-type.action';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  CreateDepartmentTypeFormSchema,
  CreateDepartmentTypeFormType,
} from '@/lib/schemas/department-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type CreateDepartmentProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateDepartment({
  open,
  onClose,
}: CreateDepartmentProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const form = useForm<CreateDepartmentTypeFormType>({
    resolver: zodResolver(CreateDepartmentTypeFormSchema),
  });

  function onSubmit(data: CreateDepartmentTypeFormType) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      toast.promise(createDepartmentType(user.id, data), {
        loading: 'Creating department...',
        success: 'Department created',
        error: 'Failed to create department',
      });
    });
  }

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Create Department</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="create-department-type-form"
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
            form="create-department-type-form"
            variant="outline"
            disabled={transitioning}
          >
            Create
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create Department</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="outline">Create</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
