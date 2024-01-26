import z from 'zod';

export const CreateAsset = z.object({
  name: z.string().min(1, {
    message: 'Missing asset name',
  }),
  description: z.string().optional(),
  type: z.string().nullable().optional(),
  location: z.string().optional(),
  createdById: z.string().min(1, {
    message: 'Missing user ID',
  }),
  personInChargeId: z.string().nullable().optional(),
  tag: z.string().optional(),
  statusId: z.string().nullable().optional(),
});

export const UpdateAsset = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Asset name cannot be empty',
    })
    .optional(),
  description: z.string().optional(),
  isArchive: z.boolean().optional(),
  statusId: z.string().optional(),
  location: z.string().optional(),
  tag: z.string().optional(),
  type: z.string().optional(),
});
