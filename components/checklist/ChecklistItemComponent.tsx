'use client';

import { ReactNode } from 'react';

import { Card } from '@nextui-org/react';

import ChecklistActions from '@/components/checklist/ChecklistAction';
import { MutatedMaintenance } from '@/types/maintenance';
import { ChecklistLibraryList } from '@/types/checklist';

type ChecklistItemComponentProps = {
  checklist: MutatedMaintenance['checklist'][0];
  checklistLibraryList: ChecklistLibraryList;
  children: ReactNode;
};

export default function ChecklistItemComponent({
  checklist,
  checklistLibraryList,
  children,
}: ChecklistItemComponentProps) {
  return (
    <Card shadow="none" className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">{checklist.asset.name}</span>
        <ChecklistActions
          checklist={checklist}
          checklistLibraryList={checklistLibraryList}
        />
      </div>
      <div className="flex flex-col space-y-2">{children}</div>
    </Card>
  );
}
