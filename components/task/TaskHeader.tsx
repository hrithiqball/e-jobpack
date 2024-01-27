'use client';

import React from 'react';

import { MoreVertical } from 'lucide-react';

import { useMediaQuery } from '@/hooks/use-media-query';

export default function TaskHeader() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div>
      <div className="flex mb-4 items-center">
        <div className="flex-1 px-4">
          <span className=" font-semibold text-sm">Task</span>
        </div>
        <div className="flex-1 px-4">
          <span className=" font-semibold text-sm"></span>
        </div>
        {isDesktop && (
          <>
            <div className="flex-1 px-4">
              <span className=" font-semibold text-sm">Issues</span>
            </div>
            <div className="flex-1 px-4">
              <span className=" font-semibold text-sm">Remarks</span>
            </div>
          </>
        )}
        <div className="flex-2 space-x-2">
          <MoreVertical size={18} className="hidden" />
        </div>
      </div>
    </div>
  );
}
