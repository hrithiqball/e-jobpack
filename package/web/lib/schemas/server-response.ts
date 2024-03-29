import { z } from 'zod';

export const ServerResponseSchema = z.object({
  success: z.boolean(),
  path: z.string(),
});

export const ResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ServerResponse = z.infer<typeof ServerResponseSchema>;
