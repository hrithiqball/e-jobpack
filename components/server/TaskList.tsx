import React, { Fragment } from 'react';
import { Task } from '@prisma/client';

import TaskItem from '@/components/server/TaskItem';
import TaskHeader from '@/components/client/task/TaskHeader';

export default function TaskList({ taskList }: { taskList: Task[] }) {
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
