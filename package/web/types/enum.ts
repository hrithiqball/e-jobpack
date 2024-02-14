import { convertToTitleCase } from '@/lib/function/convertToWord';
import { TaskType } from '@prisma/client';

export const TaskTypeEnum = Object.values(TaskType).map(value => ({
  value,
  label: convertToTitleCase(value),
}));
