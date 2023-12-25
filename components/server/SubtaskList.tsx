import React from 'react';
import SubtaskItem from '@/components/client/subtask/SubtaskItem';
import { subtask } from '@prisma/client';

export default function SubtaskList({
  subtaskList,
}: {
  subtaskList: subtask[];
}) {
  return (
    <div className="space-y-4">
      {subtaskList.map(subtask => (
        <SubtaskItem key={subtask.uid} subtask={subtask} />
      ))}
    </div>
  );
}
