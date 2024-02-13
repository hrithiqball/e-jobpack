import z from 'zod';

export const CreateAssetSchema = z.object({
  name: z.string({ required_error: 'Asset name is required' }),
  description: z.string().optional(),
  type: z.string().nullable().optional(),
  location: z.string().optional(),
  createdById: z.string({ required_error: 'Created by is required' }),
  personInChargeId: z.string().nullable().optional(),
  tag: z.string().optional(),
  statusId: z.string().nullable().optional(),
});

export const UpdateAssetSchema = z.object({
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
  assetCover: z.string().nullable().optional(),
  tag: z.string().optional(),
  type: z.string().optional(),
});

export const CreateAssetFormSchema = z.object({
  name: z.string({ required_error: 'Asset name is required' }),
  description: z.string().optional(),
  type: z.string().optional(),
  tag: z.string().optional(),
  location: z.string().optional(),
  statusId: z.string().optional(),
  personInChargeId: z.string({
    required_error: 'Person in charge is required',
  }),
});

export const UpdateAssetFormSchema = z.object({
  name: z.string({ required_error: 'Asset name is required' }).min(1, {
    message: 'Asset name cannot be empty',
  }),
  description: z.string().optional(),
  tag: z.string().optional(),
  location: z.string().optional(),
});

export type CreateAssetForm = z.infer<typeof CreateAssetFormSchema>;
export type CreateAsset = z.infer<typeof CreateAssetSchema>;
export type UpdateAsset = z.infer<typeof UpdateAssetSchema>;
export type UpdateAssetForm = z.infer<typeof UpdateAssetFormSchema>;
