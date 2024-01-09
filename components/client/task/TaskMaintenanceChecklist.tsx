'use client';

import React from 'react';
import { Card, Divider } from '@nextui-org/react';
import { Asset } from '@prisma/client';

export default function TaskMaintenanceChecklist({
  asset,
  children,
}: {
  asset: Asset;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex-1 h-full p-4">
      {/* TODO: add button to save as checklist library, import library or remove asset (client component) */}
      <p className="font-bold text-lg">{asset.name}</p>
      <Divider className="my-4" />
      <div className="flex flex-col space-y-2">{children}</div>
    </Card>
  );
}
