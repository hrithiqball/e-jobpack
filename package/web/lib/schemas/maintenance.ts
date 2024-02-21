import { z } from 'zod';

import { ChecklistSchema } from '@/lib/schemas/checklist';

export const CreateMaintenanceSchema2 = z.object({
  id: z.string().min(1, {
    message: 'Maintenance ID is required',
  }),
  maintainee: z.array(z.string()).optional().nullable(),
  assetIds: z.array(z.string()).default([]),
  startDate: z.date({ required_error: 'Start date is required' }),
  deadline: z.date().optional().nullable(),
  approvedById: z.string({
    required_error: 'Person in charge is required for approval',
  }),
  isOpen: z.boolean().default(false),
  isRequested: z.boolean().default(false),
});

export const CreateMaintenanceSchema = z.object({
  id: z.string({ required_error: 'Maintenance ID is required' }),
  approvedById: z.string({
    required_error: 'Person in charge is required for approval',
  }),
  checklist: z.array(
    z.object({
      assetId: z.string(),
      checklistId: z.string().nullable(),
    }),
  ),
  startDate: z.date({ required_error: 'Start date is required' }),
  deadline: z.date().optional().nullable(),
});

export type CreateMaintenanceType = z.infer<typeof CreateMaintenanceSchema>;

export const CreateMaintenanceFormSchema = z.object({
  id: z.string({ required_error: 'Maintenance ID is required' }),
  approvedById: z.string({
    required_error: 'Person in charge is required for approval',
  }),
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
  attachmentPath: z.array(z.string()).optional(),
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

export const CreateMaintenanceLibraryFormSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  description: z.string().optional(),
});

export type CreateMaintenance = z.infer<typeof CreateMaintenanceSchema2>;
export type CreateMaintenanceForm = z.infer<typeof CreateMaintenanceFormSchema>;
export type CreateMaintenanceLibrary = z.infer<
  typeof CreateMaintenanceLibrarySchema
>;
export type CreateMaintenanceLibraryForm = z.infer<
  typeof CreateMaintenanceLibraryFormSchema
>;
