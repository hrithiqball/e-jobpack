import { z } from 'zod';

export const ContractorUploadFileSchema = z.object({
  contractorId: z.string().min(1, 'contractorId is required'),
});

export const ContractorDownloadFileSchema = z.object({
  contractorId: z.string().min(1, 'contractorId is required'),
  filename: z.string().min(1, 'filename is required'),
});
