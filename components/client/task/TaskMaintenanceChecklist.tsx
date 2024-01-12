'use client';

import React, { ReactNode } from 'react';
import { Card, Divider } from '@nextui-org/react';
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
    <Card shadow="sm" className="flex-1 space-y-4 p-4">
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">{asset.name}</span>
        <AssetActions checklist={checklist} />
      </div>
      <Divider />
      <div className="flex flex-col space-y-2">{children}</div>
    </Card>
  );
}
