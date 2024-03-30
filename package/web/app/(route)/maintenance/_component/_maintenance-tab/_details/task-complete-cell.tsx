import { Tooltip } from '@nextui-org/react';

import { TaskItem } from '@/types/task';

type TableTaskCompleteCellProps = {
  task: TaskItem;
};

export default function TableTaskCompleteCell({
  task,
}: TableTaskCompleteCellProps) {
  function ChoiceTooltip() {
    return (
      <div className="flex flex-col">
        {task.taskSelected.map((choice, i) => (
          <p key={i}>{choice}</p>
        ))}
      </div>
    );
  }

  function Incomplete() {
    return <span className="text-red-500">Incomplete</span>;
  }

  switch (task.taskType) {
    case 'CHECK':
      return task.taskCheck ? (
        <p className="text-green-500">Checked</p>
      ) : (
        <Incomplete />
      );

    case 'NUMBER':
      return task.taskNumberVal ? (
        <span className="text-green-500">{task.taskNumberVal}</span>
      ) : (
        <Incomplete />
      );

    case 'MULTIPLE_SELECT':
      return (
        <Tooltip
          placement="right"
          radius="sm"
          isDisabled={task.taskSelected.length === 0}
          content={<ChoiceTooltip />}
        >
          <div>
            {task.taskSelected.length > 0 ? (
              <div className="flex items-center text-green-500">
                {task.taskSelected.length} choice chosen
              </div>
            ) : (
              <Incomplete />
            )}
          </div>
        </Tooltip>
      );

    case 'SINGLE_SELECT':
      return (
        <Tooltip
          placement="right"
          radius="sm"
          isDisabled={task.taskSelected.length === 0}
          content={<ChoiceTooltip />}
        >
          <div>
            {task.taskSelected.length > 0 ? (
              <span className="text-green-500">{task.taskSelected[0]}</span>
            ) : (
              <Incomplete />
            )}
          </div>
        </Tooltip>
      );

    case 'CHOICE':
      return task.taskBool === null ? (
        <Incomplete />
      ) : task.taskBool ? (
        <span className="text-green-500">Yes</span>
      ) : (
        <span className="text-green-500">No</span>
      );
  }
}
