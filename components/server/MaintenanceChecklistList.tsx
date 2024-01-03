import React from 'react';
import { checklist } from '@prisma/client';
import MaintenanceChecklist from '@/components/server/MaintenanceChecklist';

export default async function MaintenanceChecklistList({
  checklistList,
}: {
  checklistList: checklist[];
}) {
  return (
    <div className="space-y-4">
      {checklistList.map(checklist => (
        <MaintenanceChecklist key={checklist.uid} checklist={checklist} />
      ))}
    </div>
  );
}
