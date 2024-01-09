'use client';

import React from 'react';
import { Divider } from '@nextui-org/react';
import { MoreVertical } from 'lucide-react';

export default function TaskHeader() {
  return (
    <div>
      <div className="flex mb-4 items-center">
        <div className="flex-1 px-4">
          <span className=" font-bold text-medium">Task Activity</span>
        </div>
        <div className="flex-1 px-4">
          <span className=" font-bold text-medium"></span>
        </div>
        <div className="flex-1 px-4">
          <span className=" font-bold text-medium">Issues</span>
        </div>
        <div className="flex-1 px-4">
          <span className=" font-bold text-medium">Remarks</span>
        </div>
        <div className="flex-2 space-x-2">
          <MoreVertical className="hidden" />
        </div>
      </div>
      <Divider />
    </div>
  );
}
