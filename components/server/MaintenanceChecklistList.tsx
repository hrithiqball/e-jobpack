import React from 'react';
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
        <MaintenanceChecklist key={checklist.uid} checklist={checklist} />
      ))}
    </div>
  );
}
