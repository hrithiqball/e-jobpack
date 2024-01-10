import { TaskType } from '@prisma/client';

export const selectionChoices: { key: TaskType; value: string }[] = [
  {
    key: 'selectOne',
    value: 'Single Selection',
  },
  {
    key: 'selectMultiple',
    value: 'Multiple Selection',
  },
  {
    key: 'choice',
    value: 'Choice',
  },
  {
    key: 'number',
    value: 'Number',
  },
  {
    key: 'check',
    value: 'Check',
  },
];
