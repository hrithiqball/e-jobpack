import z from 'zod';

export const CreateAsset = z.object({
  name: z.string().min(1, {
    message: 'Missing asset name',
  }),
  description: z.string().optional(),
  type: z.string().nullable().optional(),
  location: z.string().optional(),
  createdBy: z.string().min(1, {
    message: 'Missing user ID',
  }),
  personInCharge: z.string().nullable().optional(),
  tag: z.string().optional(),
  statusId: z.string().optional(),
});