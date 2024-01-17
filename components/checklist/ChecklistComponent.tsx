import React, { Fragment } from 'react';
import { Checklist } from '@prisma/client';

import MaintenanceChecklist from '@/app/_components/MaintenanceChecklist';
import ClosedChecklist from '@/components/checklist/ClosedChecklist';

interface ChecklistComponentProps {
  checklistList: Checklist[];
}

export default async function ChecklistComponent({
  checklistList,
}: ChecklistComponentProps) {
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
