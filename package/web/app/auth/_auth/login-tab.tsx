import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
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

import { LoginForm, LoginFormSchema } from '@/lib/schemas/auth';
import { login } from '@/data/login.action';

export default function LoginTab() {
  const [transitioning, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl');

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
  });

  function onSubmitLogin(data: LoginForm) {
    startTransition(() => {
      toast.promise(login(data, callbackUrl), {
        position: 'top-center',
        loading: 'Logging in...',
        success: 'Login successful',
        error: (err: unknown) => {
          if (err instanceof Error) return err.message;
          return 'An error occurred';
        },
      });
    });
  }

  return (
    <div className="flex flex-col space-y-4">
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)}>
          <div className="flex flex-col space-y-4">
            <FormField
              control={loginForm.control}
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
            <div className="flex flex-col space-y-1">
              <FormField
                control={loginForm.control}
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
              <div className="flex justify-start">
                <Button
                  type="button"
                  variant="link"
                  href="/auth/reset"
                  className="px-0"
                >
                  Forgot password
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={transitioning}
              className="bg-primary"
            >
              Log In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
