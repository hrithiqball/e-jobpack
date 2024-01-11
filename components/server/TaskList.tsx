import React, { Fragment } from 'react';
import { Task } from '@prisma/client';
import TaskItem from '@/components/server/TaskItem';
import TaskHeader from '@/components/client/task/TaskHeader';

export default function TaskList({ taskList }: { taskList: Task[] }) {
  return (
    <Fragment>
      <TaskHeader />
      {taskList.map(task => (
        <TaskItem key={task.uid} task={task} />
      ))}
    </Fragment>
  );
}
