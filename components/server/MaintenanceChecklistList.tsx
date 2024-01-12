import React, { Fragment } from 'react';
import { Checklist } from '@prisma/client';
import MaintenanceChecklist from '@/components/server/MaintenanceChecklist';

export default async function MaintenanceChecklistList({
  checklistList,
}: {
  checklistList: Checklist[];
}) {
  return (
    <div className="space-y-4">
      {checklistList.map(checklist => (
        <Fragment key={checklist.id}>
          <MaintenanceChecklist checklist={checklist} />
        </Fragment>
      ))}
    </div>
  );
}
