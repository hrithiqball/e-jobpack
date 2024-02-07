import { TaskType } from '@prisma/client';
import z from 'zod';

import { SubtaskSchema } from '@/lib/schemas/subtask';

export const TaskSchema = z.object({
  createdById: z.string().min(1, { message: 'User Id is required' }),
  updatedById: z.string().min(1, { message: 'User Id is required' }),
  checklistLibraryId: z.string().min(1, {
    message: 'Checklist ID is required',
  }),
  taskActivity: z.string().min(1, {
    message: 'Task Activity is required',
  }),
  taskType: z.nativeEnum(TaskType),
  description: z.string().optional(),
  listChoice: z.array(z.string()).optional(),
  subtaskLibrary: z.array(SubtaskSchema),
  taskOrder: z.number(),
});

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
  checklistLibraryId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  listChoice: z.array(z.string()).optional(),
  taskType: z.nativeEnum(TaskType),
  taskOrder: z.number().optional(),
  id: z.string().min(1, { message: 'Task ID is required' }),
});

export const UpdateTaskLibrarySchema = z.object({
  taskActivity: z.string().min(1, { message: 'Task Activity is required' }),
  description: z.string().optional().nullable(),
  taskType: z.nativeEnum(TaskType),
  listChoice: z.array(z.string()).optional(),
  taskOrder: z.number().optional(),
});

export type TaskSchemaType = z.infer<typeof TaskSchema>;
export type CreateTaskLibrary = z.infer<typeof CreateTaskLibrarySchema>;
export type UpdateTaskLibrary = z.infer<typeof UpdateTaskLibrarySchema>;
