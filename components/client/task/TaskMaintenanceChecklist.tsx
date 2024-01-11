'use client';

import React, { ReactNode } from 'react';
import { Divider } from '@nextui-org/react';
import { Asset, Checklist } from '@prisma/client';
import AssetActions from '@/components/client/asset/AssetActions';

interface TaskMaintenanceChecklistProps {
  checklist: Checklist;
  asset: Asset;
  children: ReactNode;
}

export default function TaskMaintenanceChecklist({
  checklist,
  asset,
  children,
}: TaskMaintenanceChecklistProps) {
  return (
    <div className="flex-1 h-full">
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">{asset.name}</span>
        <AssetActions checklist={checklist} />
      </div>
      <Divider className="my-4" />
      <div className="flex flex-col space-y-2">{children}</div>
    </div>
  );
}
