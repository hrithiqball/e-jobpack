import z from 'zod';

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
  issue: z.string().optional(),
  deadline: z.date().optional(),
  listChoice: z.array(z.string()).optional(),
  checklistId: z.string().min(1, {
    message: 'Checklist ID is required',
  }),
});
