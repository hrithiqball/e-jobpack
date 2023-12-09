'use client';

import React, { useState, useTransition } from 'react';
import { subtask } from '@prisma/client';
import { updateSubtaskCompletion } from '@/app/api/server-actions';
import { Checkbox } from '@nextui-org/react';
import { VscIndent } from 'react-icons/vsc';
import { UpdateSubtask } from '@/app/api/subtask/[uid]/route';

export default function SubtaskItem({ subtask }: { subtask: subtask }) {
  let [isPending, startTransition] = useTransition();
  const [subtaskIsComplete, setSubtaskIsComplete] = useState(
    subtask.is_complete,
  );
  const [subtaskActivity, setSubtaskActivity] = useState(subtask.task_activity);

  function updateCompletion(isComplete: boolean) {
    const data: UpdateSubtask = {
      is_complete: isComplete,
    };

    startTransition(() => {
      updateSubtaskCompletion(subtask.uid, data);
    });
  }

  return (
    <div className="flex items-center">
      <VscIndent />
      <Checkbox
        className="ml-2"
        isSelected={subtaskIsComplete}
        onValueChange={() => {
          setSubtaskIsComplete(!subtaskIsComplete);
          updateCompletion(!subtaskIsComplete);
        }}
      >
        {subtaskActivity}
      </Checkbox>
    </div>
  );
}
