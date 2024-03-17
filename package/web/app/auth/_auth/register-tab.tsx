import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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

import { RegisterForm, RegisterFormSchema } from '@/lib/schemas/auth';
import { registerUser } from '@/data/user.action';

export default function RegisterTab() {
  const [transitioning, startTransition] = useTransition();

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(RegisterFormSchema),
  });
  function onSubmitRegister(data: RegisterForm) {
    startTransition(() => {
      toast.promise(registerUser(data), {
        loading: 'Registering...',
        success:
          'Registration successful. Wait for admin to approve your account',
        error: 'An error occurred',
      });
    });
  }
  return (
    <div className="flex flex-col space-y-4">
      <Form {...registerForm}>
        <form onSubmit={registerForm.handleSubmit(onSubmitRegister)}>
          <div className="flex flex-col space-y-4">
            <FormField
              control={registerForm.control}
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
              control={registerForm.control}
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
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
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
            <Button
              type="submit"
              disabled={transitioning}
              className="bg-primary"
            >
              Register
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
