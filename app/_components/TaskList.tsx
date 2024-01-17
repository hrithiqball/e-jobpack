import React, { Fragment } from 'react';
import { Task } from '@prisma/client';

import TaskItem from '@/app/_components/TaskItem';
import TaskHeader from '@/components/task/TaskHeader';

interface TaskListProps {
  taskList: Task[];
}

export default function TaskList({ taskList }: TaskListProps) {
  return (
    <Fragment>
      {taskList.length ? (
        <Fragment>
          <TaskHeader />
          {taskList.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </Fragment>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-gray-500">No task found.</p>
        </div>
      )}
    </Fragment>
  );
}
