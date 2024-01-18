import React from 'react';

import { ChecklistUse, User } from '@prisma/client';

import { fetchMutatedAssetItem } from '@/lib/actions/asset';
import DetailsWidget from '@/components/asset/DetailsWidget';
import TeamWidget from '@/components/asset/TeamWidget';
import ChecklistWidget from '@/components/asset/ChecklistWidget';
import MaintenanceWidget from '@/components/asset/MaintenanceWidget';

interface AssetDetailsProps {
  mutatedAsset: Awaited<ReturnType<typeof fetchMutatedAssetItem>>;
  checklistUse: ChecklistUse[];
  userList: User[];
}

export default function AssetDetails({
  mutatedAsset,
  checklistUse,
  userList,
}: AssetDetailsProps) {
  return (
    <div className="flex flex-1">
      <DetailsWidget mutatedAsset={mutatedAsset} />
      <div className="flex flex-col w-1/4">
        <div className="flex flex-col flex-1">
          <TeamWidget
            personInCharge={mutatedAsset.personInCharge}
            maintainee={mutatedAsset.lastMaintainee}
          />
          <ChecklistWidget checklistUse={checklistUse} />
          <MaintenanceWidget mutatedAsset={mutatedAsset} userList={userList} />
        </div>
      </div>
    </div>
  );
}
