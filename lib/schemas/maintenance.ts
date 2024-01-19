import z from 'zod';

export const CreateMaintenance = z.object({
  id: z.string().min(1, {
    message: 'ID is required',
  }),
  maintainee: z.array(z.string()).optional().nullable(),
  assetIds: z.array(z.string()),
  deadline: z.date().optional().nullable(),
  isOpen: z.boolean().default(false),
  startDate: z.date(),
  approvedBy: z.string(),
});

export const UpdateMaintenance = z.object({
  assetIds: z.array(z.string()).optional(),
  isClose: z.boolean().optional(),
  closedOn: z.date().optional(),
  closedBy: z.string().optional(),
  approvedBy: z.string().optional(),
  approvedOn: z.date().optional(),
  attachmentPath: z.string().optional(),
  maintainee: z.string().optional(),
  deadline: z.date().optional(),
  startDate: z.date().optional(),
});
