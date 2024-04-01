import { convertToTitleCase } from '@/lib/function/string';
import { Role, TaskType } from '@prisma/client';

export const TaskTypeEnum = Object.values(TaskType).map(value => ({
  value,
  label: convertToTitleCase(value),
}));

export const RoleEnum = Object.values(Role).map(value => ({
  value,
  label: convertToTitleCase(value),
}));
