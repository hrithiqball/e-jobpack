import React from 'react';
import { fetchTaskList, fetchAsset } from '@/app/api/server-actions';
import { Checklist } from '@prisma/client';
import TaskMaintenanceChecklist from '@/components/client/task/TaskMaintenanceChecklist';
import TaskList from '@/components/server/TaskList';

export default async function MaintenanceChecklist({
  checklist,
}: {
  checklist: Checklist;
}) {
  const taskList = await fetchTaskList(checklist.uid);
  const asset = await fetchAsset(checklist.asset_id);

  return (
    <TaskMaintenanceChecklist asset={asset}>
      <TaskList checklistUid={checklist.uid} taskList={taskList} />
    </TaskMaintenanceChecklist>
  );
}
