import React from 'react';
import { Maintenance } from '@prisma/client';

interface AssetMaintenanceProps {
  maintenanceList: Maintenance[];
}

export default function AssetMaintenance({
  maintenanceList,
}: AssetMaintenanceProps) {
  return (
    <div className="flex flex-grow h-full p-4">
      AssetMaintenance count is {maintenanceList.length}
    </div>
  );
}
