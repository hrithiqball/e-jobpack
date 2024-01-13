import React from 'react';
import SubtaskList from '@/components/server/SubtaskList';
import { Subtask, Task } from '@prisma/client';
import TaskRow from '@/components/client/task/TaskRow';
import { fetchSubtaskListByTaskUid } from '@/lib/actions/subtask';

export default async function TaskItem({ task }: { task: Task }) {
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
