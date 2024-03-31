import { z } from 'zod';

export const CreateDepartmentTypeFormSchema = z.object({
  value: z.string({ required_error: 'Department name is required' }),
});
export const UpdateDepartmentTypeFormSchema = z.object({
  value: z.string({ required_error: 'Department name is required' }),
});

export type CreateDepartmentTypeFormType = z.infer<
  typeof CreateDepartmentTypeFormSchema
>;
export type UpdateDepartmentTypeFormType = z.infer<
  typeof UpdateDepartmentTypeFormSchema
>;
