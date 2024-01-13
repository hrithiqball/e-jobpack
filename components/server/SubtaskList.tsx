import React from 'react';
import SubtaskItem from '@/components/client/subtask/SubtaskItem';
import { Subtask } from '@prisma/client';

export default function SubtaskList({
  subtaskList,
}: {
  subtaskList: Subtask[];
}) {
  return (
    <div className="space-y-4">
      {subtaskList.map(subtask => (
        <SubtaskItem key={subtask.id} subtask={subtask} />
      ))}
    </div>
  );
}
