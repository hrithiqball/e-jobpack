import { z } from 'zod';

export const UserUploadFileSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
});

export const UserDownloadFileSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  filename: z.string().min(1, 'filename is required'),
});

export const UserDeleteFileSchema = z.object({
  filename: z.string().min(1, 'filename is required'),
});
