import { Tooltip } from '@nextui-org/react';
import { TaskType } from '@prisma/client';
import { Binary, Check, Dice2, ListChecks } from 'lucide-react';
type TaskTypeHelperProps = {
  taskType: TaskType;
  size: number;
};

export default function TaskTypeHelper({
  taskType,
  size,
}: TaskTypeHelperProps) {
  switch (taskType) {
    case 'CHECK':
      return (
        <Tooltip content="Check" className="cursor-help">
          <Check size={size} />
        </Tooltip>
      );

    case 'CHOICE':
      return (
        <Tooltip content="Choice" className="cursor-help">
          <Dice2 size={size} />
        </Tooltip>
      );

    case 'SINGLE_SELECT':
    case 'MULTIPLE_SELECT':
      return (
        <Tooltip
          content={
            taskType === 'SINGLE_SELECT'
              ? 'Single Selection'
              : 'Multiple Selection'
          }
          className="cursor-help"
        >
          <ListChecks size={size} />
        </Tooltip>
      );

    case 'NUMBER':
      return (
        <Tooltip content="Number" className="cursor-help">
          <Binary size={size} />
        </Tooltip>
      );
  }
}
