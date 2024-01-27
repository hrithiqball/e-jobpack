import React from 'react';
import dynamic from 'next/dynamic';

import { Checklist } from '@prisma/client';

import TaskMaintenanceChecklist from '@/components/checklist/ChecklistItemComponent';
import { fetchTaskList } from '@/lib/actions/task';
import { fetchAssetItem } from '@/lib/actions/asset';

const TaskTable = dynamic(() => import('@/components/task/TaskTable'), {
  ssr: false,
});
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
      <TaskTable taskList={taskList} />
    </TaskMaintenanceChecklist>
  );
}
