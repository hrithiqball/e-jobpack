import React from 'react';
import SubtaskList from '@/components/server/SubtaskList';
import { Subtask, Task } from '@prisma/client';
import TaskRow from '@/components/client/task/TaskRow';
import { fetchSubtaskListByTaskUid } from '@/lib/actions/subtask';

export default async function TaskItem({ task }: { task: Task }) {
  let subtaskList: Subtask[] = [];

  if (task.have_subtask) {
    subtaskList = await fetchSubtaskListByTaskUid(task.uid);
  }

  return (
    <div>
      <TaskRow task={task} />
      {task.have_subtask && (
        <div className="mt-4 mb-1">
          <SubtaskList subtaskList={subtaskList} />
        </div>
      )}
    </div>
  );
}
