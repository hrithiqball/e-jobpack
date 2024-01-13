import React from 'react';
import { Subtask } from '@prisma/client';

import SubtaskItem from '@/components/client/subtask/SubtaskItem';

interface SubtaskListProps {
  subtaskList: Subtask[];
}

export default function SubtaskList({ subtaskList }: SubtaskListProps) {
  return (
    <div className="space-y-4">
      {subtaskList.map(subtask => (
        <SubtaskItem key={subtask.id} subtask={subtask} />
      ))}
    </div>
  );
}
