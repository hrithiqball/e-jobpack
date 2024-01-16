import React from 'react';

import { Asset, ChecklistUse, User } from '@prisma/client';

import DetailsWidget from '@/components/client/asset/DetailsWidget';
import TeamWidget from '@/components/client/asset/TeamWidget';
import ChecklistWidget from '@/components/client/asset/ChecklistWidget';
import MaintenanceWidget from '@/components/client/asset/MaintenanceWidget';

interface AssetDetailsProps {
  asset: Asset;
  checklistUse: ChecklistUse[];
  userList: User[];
}

export default function AssetDetails({
  asset,
  checklistUse,
  userList,
}: AssetDetailsProps) {
  return (
    <div className="flex flex-1">
      <DetailsWidget asset={asset} />
      <div className="flex flex-col w-1/4">
        <div className="flex flex-col flex-1">
          <TeamWidget />
          <ChecklistWidget checklistUse={checklistUse} />
          <MaintenanceWidget asset={asset} userList={userList} />
        </div>
      </div>
    </div>
  );
}
