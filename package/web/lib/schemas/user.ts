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

export type CreateUserAdminForm = z.infer<typeof CreateUserAdminSchema>;

export type AdminUpdateUser = {
  id: string;
  role: Role;
  departmentId: string;
};
