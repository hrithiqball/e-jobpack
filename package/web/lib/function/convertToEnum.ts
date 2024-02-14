import { TaskType } from '@prisma/client';
import { convertToTitleCase } from '@/lib/function/convertToWord';

export function convertToTaskTypeEnum(taskType: TaskType) {
  return {
    value: taskType,
    label: convertToTitleCase(taskType),
  };
}
