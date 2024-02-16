import { z } from 'zod';

export const DeleteFileSchema = z.object({
  filename: z.string().min(1, 'filename is required'),
});
