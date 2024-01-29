import { TaskType } from '@prisma/client';
import z from 'zod';

export const CreateTask = z.object({
  taskActivity: z.string().min(1, {
    message: 'Task Activity is required',
  }),
  description: z.string().optional().nullable(),
  deadline: z.date().optional().nullable(),
  haveSubtask: z.boolean().optional(),
  listChoice: z.array(z.string()).optional(),
  checklistId: z.string().min(1, {
    message: 'Checklist ID is required',
  }),
});

export const UpdateTask = z.object({
  taskActivity: z.string().optional(),
  description: z.string().optional(),
  remarks: z.string().optional(),
  issue: z.string().optional(),
  isComplete: z.boolean().optional(),
  deadline: z.date().optional(),
  haveSubtask: z.boolean().optional(),
  listChoice: z.array(z.string()).optional(),
  taskOrder: z.number().optional(),
  taskSelected: z.array(z.string()).optional(),
  taskBool: z.boolean().optional(),
  taskNumberVal: z.number().optional(),
});

export const CreateTaskLibrarySchema = z.object({
  taskActivity: z.string().min(1, { message: 'Task Activity is required' }),
  description: z.string().optional().nullable(),
  listChoice: z.array(z.string()).optional(),
  taskType: z.nativeEnum(TaskType),
  id: z.string().min(1, { message: 'Task ID is required' }),
});

export type CreateTaskLibrary = z.infer<typeof CreateTaskLibrarySchema>;
