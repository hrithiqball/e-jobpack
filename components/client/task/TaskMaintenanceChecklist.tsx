'use client';

import React, { ReactNode } from 'react';
import { Card, Divider } from '@nextui-org/react';
import { Asset } from '@prisma/client';
import AssetActions from '@/components/client/asset/AssetActions';

export default function TaskMaintenanceChecklist({
  asset,
  children,
}: {
  asset: Asset;
  children: ReactNode;
}) {
  return (
    <Card className="flex-1 h-full p-4">
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">{asset.name}</span>
        <AssetActions />
      </div>
      <Divider className="my-4" />
      <div className="flex flex-col space-y-2">{children}</div>
    </Card>
  );
}
