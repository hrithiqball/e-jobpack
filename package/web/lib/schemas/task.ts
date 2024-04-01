import { TaskType } from '@prisma/client';
import { z } from 'zod';

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

export const AddTaskFormSchema = z.object({
  taskActivity: z
    .string({ required_error: 'Task activity is required' })
    .min(1, { message: 'Task activity is required' }),
  description: z.string().optional(),
});

export const CreateTaskSchema = z.object({
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

export const UpdateTaskSchema = z.object({
  taskActivity: z
    .string({ required_error: 'Task activity is required' })
    .optional(),
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
  taskType: z.nativeEnum(TaskType).optional(),
  taskCheck: z.boolean().optional(),
});

export const UpdateTaskIssueFormSchema = z.object({
  issue: z.string().optional(),
});

export const UpdateTaskRemarksFormSchema = z.object({
  remarks: z.string().optional(),
});

export const UpdateTaskFormSchema = z.object({
  taskActivity: z.string({ required_error: 'Task name is required' }),
  description: z.string().optional(),
  taskType: z.nativeEnum(TaskType),
});

export const UpdateTaskDetailsFormSchema = z.object({
  taskActivity: z
    .string({ required_error: 'Task activity is required' })
    .min(1, { message: 'Task activity is required' }),
  description: z.string(),
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

export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskIssueForm = z.infer<typeof UpdateTaskIssueFormSchema>;
export type UpdateTaskRemarksForm = z.infer<typeof UpdateTaskRemarksFormSchema>;
export type AddTaskForm = z.infer<typeof AddTaskFormSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type UpdateTaskForm = z.infer<typeof UpdateTaskFormSchema>;
export type UpdateTaskDetailsForm = z.infer<typeof UpdateTaskDetailsFormSchema>;

export type TaskSchemaType = z.infer<typeof TaskSchema>;
export type CreateTaskLibrary = z.infer<typeof CreateTaskLibrarySchema>;
export type UpdateTaskLibrary = z.infer<typeof UpdateTaskLibrarySchema>;
