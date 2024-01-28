'use client';

import React, { ReactNode } from 'react';

import { Card } from '@nextui-org/react';

import ChecklistActions from '@/components/checklist/ChecklistAction';
import { MutatedMaintenance } from '@/types/maintenance';

interface ChecklistItemComponentProps {
  checklist: MutatedMaintenance['checklist'][0];
  children: ReactNode;
}

export default function ChecklistItemComponent({
  checklist,
  children,
}: ChecklistItemComponentProps) {
  return (
    <Card shadow="none" className="flex-1 space-y-4 p-4">
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">{checklist.asset.name}</span>
        <ChecklistActions checklist={checklist} />
      </div>
      <div className="flex flex-col space-y-2">{children}</div>
    </Card>
  );
}
