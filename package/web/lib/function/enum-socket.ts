import { TaskType } from '@prisma/client';
import { convertToTitleCase } from '@/lib/function/string';

export function convertToTaskTypeEnum(taskType: TaskType) {
  return {
    value: taskType,
    label: convertToTitleCase(taskType),
  };
}
