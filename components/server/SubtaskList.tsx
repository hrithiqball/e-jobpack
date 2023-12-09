import React from 'react';
import SubtaskItem from '@/components/client/SubtaskItem';
import { subtask } from '@prisma/client';

export default function SubtaskList({
  subtaskList,
}: {
  subtaskList: subtask[];
}) {
  return (
    // <div className="border border-gray-400 rounded-lg">
    <div>
      {subtaskList.map(subtask => (
        <SubtaskItem key={subtask.uid} subtask={subtask} />
      ))}
    </div>
  );
}
