import React from 'react';
import { fetchTaskList } from '@/app/api/server-actions';
import { checklist } from '@prisma/client';
import TaskMaintenanceChecklist from '@/components/client/task/TaskMaintenanceChecklist';
import TaskList from '@/components/server/TaskList';

export default async function MaintenanceChecklist({
  checklist,
}: {
  checklist: checklist;
}) {
  const taskList = await fetchTaskList(checklist.uid);

  return (
    <TaskMaintenanceChecklist checklist={checklist}>
      <TaskList checklistUid={checklist.uid} taskList={taskList} />
    </TaskMaintenanceChecklist>
  );
}
