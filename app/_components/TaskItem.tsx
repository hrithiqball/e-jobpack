import React from 'react';
import { Subtask, Task } from '@prisma/client';

import { fetchSubtaskListByTaskUid } from '@/lib/actions/subtask';
import SubtaskList from '@/app/_components/SubtaskList';
import TaskRow from '@/components/task/TaskRow';

interface TaskItemProps {
  task: Task;
}

export default async function TaskItem({ task }: TaskItemProps) {
  let subtaskList: Subtask[] = [];

  if (task.haveSubtask) {
    subtaskList = await fetchSubtaskListByTaskUid(task.id);
  }

  return (
    <div>
      <TaskRow task={task} />
      {task.haveSubtask && (
        <div className="mt-4 mb-1">
          <SubtaskList subtaskList={subtaskList} />
        </div>
      )}
    </div>
  );
}
