import { TaskType } from '@prisma/client';

export const selectionChoices: { key: TaskType; value: string }[] = [
  {
    key: 'SINGLE_SELECT',
    value: 'Single Selection',
  },
  {
    key: 'MULTIPLE_SELECT',
    value: 'Multiple Selection',
  },
  {
    key: 'CHOICE',
    value: 'Choice',
  },
  {
    key: 'NUMBER',
    value: 'Number',
  },
  {
    key: 'CHECK',
    value: 'Check',
  },
];
