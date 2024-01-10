import React from 'react';
import { Checklist } from '@prisma/client';

import TaskMaintenanceChecklist from '@/components/client/task/TaskMaintenanceChecklist';
import TaskList from '@/components/server/TaskList';
import { fetchTaskList } from '@/lib/actions/task';
import { fetchAsset } from '@/lib/actions/asset';

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
