import React from 'react';
import { Skeleton } from '@nextui-org/react';

function SkeletonList() {
  return (
    <div className="max-w-[300px] w-full flex items-center gap-3 mb-4">
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}

export default SkeletonList;
