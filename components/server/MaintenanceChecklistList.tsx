import React, { Fragment } from 'react';
import { Checklist } from '@prisma/client';
import MaintenanceChecklist from '@/components/server/MaintenanceChecklist';
import ClosedChecklist from '../client/checklist/ClosedChecklist';

export default async function MaintenanceChecklistList({
  checklistList,
}: {
  checklistList: Checklist[];
}) {
  return (
    <div className="space-y-4">
      <ClosedChecklist
        checklistList={checklistList.filter(
          checklistList => checklistList.isClose,
        )}
      />
      {checklistList
        .filter(checklist => !checklist.isClose)
        .map(checklist => (
          <Fragment key={checklist.id}>
            <MaintenanceChecklist checklist={checklist} />
          </Fragment>
        ))}
    </div>
  );
}
