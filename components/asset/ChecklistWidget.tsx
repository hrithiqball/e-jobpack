import React from 'react';

import { ChecklistUse } from '@prisma/client';

import { Card, Chip } from '@nextui-org/react';
import { FilePenLine } from 'lucide-react';

interface ChecklistWidgetProps {
  checklistUse: ChecklistUse[];
}

export default function ChecklistWidget({
  checklistUse,
}: ChecklistWidgetProps) {
  return (
    <div className="flex flex-1 p-2">
      <Card shadow="none" className="flex flex-1 p-4">
        <div className="flex flex-row items-center">
          <FilePenLine />
          <span className="font-bold ml-4">Checklist</span>
        </div>
        <div className="">
          {checklistUse.map(checklist => (
            <div key={checklist.id} className="flex flex-row items-center">
              <Chip variant="faded">{checklist.title}</Chip>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
