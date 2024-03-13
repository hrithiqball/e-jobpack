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
import { Button } from '@/components/ui/button';

import { useMediaQuery } from '@/hooks/use-media-query';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const CreateUserAdminSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, { message: 'Name is required' }),
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export type CreateUserAdminForm = z.infer<typeof CreateUserAdminSchema>;

type CreateUserProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateUser({ open, onClose }: CreateUserProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const form = useForm<CreateUserAdminForm>({
    resolver: zodResolver(CreateUserAdminSchema),
  });

  function onSubmit(data: CreateUserAdminForm) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      toast.success(`User created ${data.name}`);
    });
  }

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            <h2>Create User</h2>
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="admin-create-user-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <sup className="text-red-500">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <sup className="text-red-500">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <Button
            form="admin-create-user-form"
            type="submit"
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
          <DrawerTitle>
            <h2>Create User</h2>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Create</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
