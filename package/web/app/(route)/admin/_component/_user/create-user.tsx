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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { useMediaQuery } from '@/hooks/use-media-query';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoleEnum } from '@/types/enum';
import { Label } from '@/components/ui/label';
import { CreateUserAdminForm, CreateUserAdminSchema } from '@/lib/schemas/user';
import { adminCreateUser } from '@/data/user.action';
import { Role } from '@prisma/client';
import { useDepartmentTypeStore } from '@/hooks/use-department-type.store';
import { Loader } from '@/components/ui/loader';

type CreateUserProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateUser({ open, onClose }: CreateUserProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const { departmentTypes } = useDepartmentTypeStore();

  const [userRole, setUserRole] = useState('');
  const [userDepartment, setUserDepartment] = useState('');
  const [roleErrMessage, setRoleErrMessage] = useState(false);
  const [departmentErrMessage, setDepartmentErrMessage] = useState(false);

  const form = useForm<CreateUserAdminForm>({
    resolver: zodResolver(CreateUserAdminSchema),
  });

  function onSubmit(data: CreateUserAdminForm) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      if (!userRole) {
        setRoleErrMessage(true);
        return;
      }

      if (!userDepartment) {
        setDepartmentErrMessage(true);
        return;
      }

      toast.promise(adminCreateUser(data, userRole as Role, userDepartment), {
        loading: 'Creating user...',
        success: 'User created',
        error: 'Failed to create user',
      });
    });
  }

  function handleRoleChange(value: string) {
    setUserRole(value);
    setRoleErrMessage(false);
  }

  function handleDepartmentChange(value: string) {
    setUserDepartment(value);
    setDepartmentErrMessage(false);
  }

  function handleClose() {
    onClose();
  }

  if (!departmentTypes) return <Loader />;

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Create User</SheetTitle>
          <SheetDescription>
            Created user&apos;s email will automatically be approved
          </SheetDescription>
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
              <div className="flex flex-col space-y-4">
                <Label className="font-semibold">Role</Label>
                <Select value={userRole} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    {RoleEnum.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {roleErrMessage && (
                  <span className="text-red-500">Role is required</span>
                )}
              </div>
              <div className="flex flex-col space-y-4">
                <Label className="font-semibold">Department</Label>
                <Select
                  value={userDepartment}
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentTypes.map(department => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {departmentErrMessage && (
                  <span className="text-red-500">Department is required</span>
                )}
              </div>
            </div>
          </form>
        </Form>
        <SheetFooter>
          <Button
            form="admin-create-user-form"
            type="submit"
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
          <DrawerTitle>Create User</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Create</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
