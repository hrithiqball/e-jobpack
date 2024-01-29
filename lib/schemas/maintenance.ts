import z from 'zod';

import { ChecklistSchema } from '@/lib/schemas/checklist';

export const CreateMaintenance = z.object({
  id: z.string().min(1, {
    message: 'ID is required',
  }),
  maintainee: z.array(z.string()).optional().nullable(),
  assetIds: z.array(z.string()),
  deadline: z.date().optional().nullable(),
  startDate: z.date(),
  approvedById: z.string(),
  isOpen: z.boolean().default(false),
  isRequested: z.boolean().default(false),
});

export const UpdateMaintenance = z.object({
  assetIds: z.array(z.string()).optional(),
  isClose: z.boolean().optional(),
  closedOn: z.date().optional(),
  closedById: z.string().optional(),
  approvedById: z.string().optional(),
  isRejected: z.boolean().optional(),
  rejectReason: z.string().optional(),
  isRequested: z.boolean().optional(),
  isOpen: z.boolean().optional(),
  rejectedById: z.string().optional(),
  rejectedOn: z.date().optional(),
  approvedOn: z.date().optional(),
  attachmentPath: z.string().optional(),
  maintainee: z.string().optional(),
  deadline: z.date().optional(),
  startDate: z.date().optional(),
});

export const CreateMaintenanceLibrarySchema = z.object({
  title: z.string().min(1, { message: 'Missing title' }),
  description: z.string().optional(),
  createdById: z.string().min(1, { message: 'User Id is required' }),
  updatedById: z.string().min(1, { message: 'User Id is required' }),
  checklistLibrary: z.array(ChecklistSchema),
});

export type CreateMaintenanceLibrary = z.infer<
  typeof CreateMaintenanceLibrarySchema
>;
