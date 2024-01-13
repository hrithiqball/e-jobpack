import z from 'zod';

export const CreateMaintenance = z.object({
  // maintainee: z.array(z.string()).optional(),
  maintainee: z.string().nullable().optional(),
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
