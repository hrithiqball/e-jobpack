import React, { Fragment } from 'react';
import { checklist } from '@prisma/client';
import MaintenanceChecklist from '@/components/server/MaintenanceChecklist';

export default async function MaintenanceChecklistList({
  checklistList,
}: {
  checklistList: checklist[];
}) {
  return (
    <Fragment>
      {checklistList.map(checklist => (
        <MaintenanceChecklist key={checklist.uid} checklist={checklist} />
      ))}
    </Fragment>
  );
}
