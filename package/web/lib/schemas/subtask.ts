import { TaskType } from '@prisma/client';
import z from 'zod';

export const SubtaskSchema = z.object({
  createdById: z.string().min(1, { message: 'User Id is required' }),
  updatedById: z.string().min(1, { message: 'User Id is required' }),
  taskLibraryId: z.string().min(1, {
    message: 'Task ID is required',
  }),
  taskActivity: z.string().min(1, {
    message: 'Task Activity is required',
  }),
  taskType: z.nativeEnum(TaskType),
  description: z.string().optional().nullable(),
  listChoice: z.array(z.string()).optional(),
  taskOrder: z.number(),
});

export const CreateSubtask = z.object({
  taskActivity: z.string().min(1, {
    message: 'Task Activity is required',
  }),
  description: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  issue: z.string().optional().nullable(),
  deadline: z.date().optional().nullable(),
  taskId: z.string().min(1, {
    message: 'Task ID is required',
  }),
  taskBool: z.boolean().optional(),
  listChoice: z.array(z.string()).optional(),
  checklistId: z.string().min(1, {
    message: 'Checklist ID is required',
  }),
});

export const UpdateSubtask = z.object({
  taskActivity: z.string().optional(),
  description: z.string().optional(),
  remarks: z.string().optional(),
  isComplete: z.boolean().optional(),
  issue: z.string().optional(),
  deadline: z.date().optional(),
  listChoice: z.array(z.string()).optional(),
  completedById: z.string().optional(),
  taskOrder: z.number().optional(),
  taskBool: z.boolean().optional(),
  taskSelected: z.string().array().optional(),
  taskNumberVal: z.number().optional(),
});

export const CreateSubtaskLibrarySchema = z.object({
  taskActivity: z.string().min(1, { message: 'Task Activity is required' }),
  description: z.string().optional().nullable(),
  listChoice: z.array(z.string()).optional(),
  taskType: z.nativeEnum(TaskType),
  taskId: z.string().min(1, { message: 'Task ID is required' }),
  taskOrder: z.number().optional(),
});

export type CreateSubtaskLibrary = z.infer<typeof CreateSubtaskLibrarySchema>;
