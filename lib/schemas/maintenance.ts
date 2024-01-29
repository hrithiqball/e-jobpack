import { TaskType } from '@prisma/client';
import z from 'zod';

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
  checklist: z.array(z.string()),
});

export type Checklist = {
  id: string;
  title: string;
  description: string;
  assetId: string;
  taskList: Task[];
};

export type Task = {
  taskActivity: string;
  taskType: TaskType;
  description: string | undefined;
  listChoice: string[] | undefined;
};
