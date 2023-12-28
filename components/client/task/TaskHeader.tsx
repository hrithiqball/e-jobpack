'use client';

import React from 'react';
import { Divider } from '@nextui-org/react';
import { LuMoreVertical } from 'react-icons/lu';

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
          <LuMoreVertical className="hidden" />
        </div>
      </div>
      <Divider />
    </div>
  );
}
