import React from 'react';
import { Checklist } from '@prisma/client';

import TaskMaintenanceChecklist from '@/components/client/checklist/ChecklistItemComponent';
import TaskList from '@/components/server/TaskList';
import { fetchTaskList } from '@/lib/actions/task';
import { fetchAssetItem } from '@/lib/actions/asset';

interface MaintenanceChecklistProps {
  checklist: Checklist;
}

export default async function MaintenanceChecklist({
  checklist,
}: MaintenanceChecklistProps) {
  const taskList = await fetchTaskList(checklist.id);
  const asset = await fetchAssetItem(checklist.assetId);

  return (
    <TaskMaintenanceChecklist checklist={checklist} asset={asset}>
      <TaskList taskList={taskList} />
    </TaskMaintenanceChecklist>
  );
}
