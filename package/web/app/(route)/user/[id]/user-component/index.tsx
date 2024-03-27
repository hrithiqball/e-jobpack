'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  UpdatePasswordForm,
  UpdatePasswordFormSchema,
} from '@/lib/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import EditUser from './edit';
import { Loader } from '@/components/ui/loader';
import { useUserStore } from '@/hooks/use-user.store';
import { User } from '@prisma/client';
import UserDetails from './details';
import { compare } from 'bcryptjs';
import { toast } from 'sonner';
import { updatePassword } from '@/data/user.action';
import { useDepartmentTypeStore } from '@/hooks/use-department-type.store';
import { DepartmentTypes } from '@/types/department-enum';

type UserDetailsProps = { userData: User; departments: DepartmentTypes };

export default function UserComponent({
  userData,
  departments,
}: UserDetailsProps) {
  const [transitioning, startTransition] = useTransition();

  const { user, setUser } = useUserStore();
  const { setDepartments } = useDepartmentTypeStore();

  const [openEditUser, setOpenEditUser] = useState(false);

  useEffect(() => {
    setUser(userData);
    setDepartments(departments);
  }, [userData, setUser, departments, setDepartments]);

  const form = useForm<UpdatePasswordForm>({
    resolver: zodResolver(UpdatePasswordFormSchema),
  });

  async function onUpdatePassword(data: UpdatePasswordForm) {
    if (!user) {
      toast.error('Session expired!');
      return;
    }

    const passwordsMatch = await compare(data.currentPassword, user.password);

    if (!passwordsMatch) {
      toast.error('Current password is incorrect');
      return;
    }

    startTransition(() => {
      toast.promise(updatePassword(user.id, data.newPassword), {
        loading: 'Updating password...',
        success: () => {
          return 'Password updated successfully';
        },
        error: 'An error occurred',
      });
    });
  }

  function handleOpenEditUser() {
    setOpenEditUser(true);
  }

  function handleCloseEditUser() {
    setOpenEditUser(false);
  }

  if (!user) return <Loader />;

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-row-reverse">
        <Button size="withIcon" variant="outline" onClick={handleOpenEditUser}>
          <Edit size={18} />
          <p>Edit</p>
        </Button>
      </div>
      <UserDetails />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Change Password</AccordionTrigger>
          <AccordionContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onUpdatePassword)}
                className="space-y-4"
                id="update-password-form"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row-reverse">
                  <Button
                    form="update-password-form"
                    type="submit"
                    variant="outline"
                    disabled={transitioning}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <EditUser user={user} open={openEditUser} onClose={handleCloseEditUser} />
    </div>
  );
}
