import { Tooltip } from '@nextui-org/react';

import { TaskItem } from '@/types/task';

type TableTaskCompleteCellProps = {
  task: TaskItem;
};

export default function TableTaskCompleteCell({
  task,
}: TableTaskCompleteCellProps) {
  function ListChoiceTooltip() {
    return (
      <div className="flex flex-col">
        {task.listChoice.map((choice, i) => (
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
        <span>{task.taskNumberVal}</span>
      ) : (
        <Incomplete />
      );

    case 'MULTIPLE_SELECT':
      return (
        <Tooltip placement="right" content={<ListChoiceTooltip />}>
          <div>
            {task.taskSelected.length > 0 ? (
              <div className="flex items-center">
                {task.taskSelected.map(choice => (
                  <p key={choice}>{choice}</p>
                ))}
              </div>
            ) : (
              <Incomplete />
            )}
          </div>
        </Tooltip>
      );

    case 'SINGLE_SELECT':
      return (
        <Tooltip placement="right" content={<ListChoiceTooltip />}>
          <div>
            {task.taskSelected.length > 0 ? (
              <span>complete single</span>
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
        <span>Yes</span>
      ) : (
        <span>No</span>
      );
  }
}
