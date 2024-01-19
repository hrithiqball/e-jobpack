'use client';

import React, { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react';

export default function TaskHeader() {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 650);

  function updateMedia() {
    setDesktop(window.innerWidth > 650);
  }

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

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
