import React from 'react';
import { maintenance } from '@prisma/client';

export default function AssetMaintenance({
  maintenanceList,
}: {
  maintenanceList: maintenance[];
}) {
  return (
    <div className="flex flex-grow h-full p-4">
      AssetMaintenance count is {maintenanceList.length}
    </div>
  );
}
