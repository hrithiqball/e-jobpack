import { z } from 'zod';

export const CreateContractorFormSchema = z.object({
  name: z
    .string({ required_error: 'Contractor name is required' })
    .min(1, { message: 'Contractor name cannot be empty' }),
  contact: z.string().optional(),
  company: z.string().optional(),
  color: z.string().optional(),
  contractorTypeId: z.string().optional(),
});

export type CreateContractorForm = z.infer<typeof CreateContractorFormSchema>;
