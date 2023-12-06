import React, { Fragment } from 'react';
import { checklist, maintenance } from '@prisma/client';
import MaintenanceChecklist from './MaintenanceChecklist';

export default async function MaintenanceChecklistList({
  maintenance,
  checklistList,
}: {
  maintenance: maintenance;
  checklistList: checklist[];
}) {
  return (
    <Fragment>
      {checklistList.map(checklist => (
        <MaintenanceChecklist
          key={checklist.uid}
          maintenance={maintenance}
          checklist={checklist}
        />
      ))}
    </Fragment>
  );
}
