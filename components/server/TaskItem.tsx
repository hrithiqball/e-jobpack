import React from 'react';
import SubtaskList from '@/components/server/SubtaskList';
import { fetchSubtaskListByTaskUid } from '@/app/api/server-actions';
import { subtask, task } from '@prisma/client';
import TaskRow from '@/components/client/task/TaskRow';

export default async function TaskItem({ task }: { task: task }) {
  let subtaskList: subtask[] = [];

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
