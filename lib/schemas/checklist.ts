import z from 'zod';

export const CreateChecklist = z.object({
  assetId: z.string().min(1, {
    message: 'Missing asset ID',
  }),
  createdById: z.string().min(1, {
    message: 'Missing user ID',
  }),
  maintenanceId: z.string().min(1, {
    message: 'Missing maintenance ID',
  }),
  description: z.string().optional(),
});

export const UpdateChecklist = z.object({
  updatedById: z.string().min(1, {
    message: 'Missing user ID',
  }),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  isClose: z.boolean().optional(),
});
