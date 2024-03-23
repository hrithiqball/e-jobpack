import { convertToTitleCase } from '@/lib/function/string';
import { Department, Role, TaskType } from '@prisma/client';

export const TaskTypeEnum = Object.values(TaskType).map(value => ({
  value,
  label: convertToTitleCase(value),
}));

export const RoleEnum = Object.values(Role).map(value => ({
  value,
  label: convertToTitleCase(value),
}));

export const DepartmentEnum = Object.values(Department).map(value => ({
  value,
  label: convertToTitleCase(value),
}));
