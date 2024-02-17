import { z } from 'zod';

export const AssetUploadFileSchema = z.object({
  assetId: z.string().min(1, 'userId is required'),
});

export const AssetDownloadFileSchema = z.object({
  assetId: z.string().min(1, 'userId is required'),
  filename: z.string().min(1, 'filename is required'),
});
