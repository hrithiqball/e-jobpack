import React, { Fragment } from 'react';
import { fetchTaskList } from '@/app/api/server-actions';
import { checklist, maintenance } from '@prisma/client';
import TaskMaintenanceChecklist from '@/components/client/TaskMaintenanceChecklist';
import TaskList from '@/components/server/TaskList';

export default async function MaintenanceChecklist({
  maintenance,
  checklist,
}: {
  maintenance: maintenance;
  checklist: checklist;
}) {
  const taskList = await fetchTaskList(checklist.uid);

  return (
    <Fragment>
      <TaskMaintenanceChecklist checklist={checklist}>
        <TaskList checklistUid={checklist.uid} taskList={taskList} />
      </TaskMaintenanceChecklist>
    </Fragment>
  );
}
