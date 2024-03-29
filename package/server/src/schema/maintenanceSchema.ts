import { z } from 'zod';

export const MaintenanceUploadFileSchema = z.object({
  maintenanceId: z.string().min(1, 'userId is required'),
});

export const MaintenanceChecklistUploadFileSchema = z.object({
  maintenanceId: z.string().min(1, 'userId is required'),
  checklistId: z.string().min(1, 'checklistId is required'),
});

export const MaintenanceDownloadFileSchema = z.object({
  maintenanceId: z.string().min(1, 'userId is required'),
  filename: z.string().min(1, 'filename is required'),
});
