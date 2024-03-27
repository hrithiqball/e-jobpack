import { Role } from '@prisma/client';
import { z } from 'zod';

export const CreateUserAdminSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, { message: 'Name is required' }),
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  phone: z.string().optional(),
});

export const UpdatePasswordFormSchema = z
  .object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, {
        message: 'Password must be at least 6 characters',
      }),
    confirmPassword: z.string({
      required_error: 'Confirm password is required',
    }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const UpdateUserDetailsSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1, {
    message: "Name can't be empty",
  }),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
});

export type CreateUserAdminForm = z.infer<typeof CreateUserAdminSchema>;
export type UpdatePasswordForm = z.infer<typeof UpdatePasswordFormSchema>;
export type UpdateUserDetailsForm = z.infer<typeof UpdateUserDetailsSchema>;
export type AdminUpdateUser = {
  id: string;
  role: Role;
  departmentId: string;
};
