import React, { Fragment } from 'react';
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
    <Fragment>
      <TaskMaintenanceChecklist checklist={checklist}>
        <TaskList checklistUid={checklist.uid} taskList={taskList} />
      </TaskMaintenanceChecklist>
    </Fragment>
  );
}
