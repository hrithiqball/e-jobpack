'use client';

import { Card } from '@nextui-org/react';

import { Maintenance } from '@/types/maintenance';
import { ChecklistLibraryList } from '@/types/checklist';

import ChecklistActions from './_checklist-actions';
import TaskTable from './_table';

type ChecklistItemComponentProps = {
  checklist: Maintenance['checklist'][0];
  checklistLibraryList: ChecklistLibraryList;
};

export default function ChecklistItemComponent({
  checklist,
  checklistLibraryList,
}: ChecklistItemComponentProps) {
  return (
    <Card shadow="none" className="flex-1 space-y-4 p-4 dark:bg-card">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">{checklist.asset.name}</span>
        <ChecklistActions
          checklist={checklist}
          checklistLibraryList={checklistLibraryList}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <TaskTable taskList={checklist.task} />
      </div>
    </Card>
  );
}
