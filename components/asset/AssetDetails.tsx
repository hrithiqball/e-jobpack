import React from 'react';

import { AssetStatus, AssetType, User } from '@prisma/client';

import DetailsWidget from '@/components/asset/DetailsWidget';
import TeamWidget from '@/components/asset/TeamWidget';
import ChecklistWidget from '@/components/asset/ChecklistWidget';
import MaintenanceWidget from '@/components/asset/MaintenanceWidget';
import { MutatedAsset } from '@/types/asset';

interface AssetDetailsProps {
  mutatedAsset: MutatedAsset;
  statusList: AssetStatus[];
  typeList: AssetType[];
  userList: User[];
}

export default function AssetDetails({
  mutatedAsset,
  statusList,
  typeList,
  userList,
}: AssetDetailsProps) {
  return (
    <div className="flex flex-1">
      <DetailsWidget
        mutatedAsset={mutatedAsset}
        statusList={statusList}
        typeList={typeList}
      />
      <div className="flex flex-col w-1/4">
        <div className="flex flex-col flex-1">
          <TeamWidget
            personInCharge={mutatedAsset.personInCharge}
            maintainee={mutatedAsset.lastMaintainee}
          />
          <ChecklistWidget />
          <MaintenanceWidget mutatedAsset={mutatedAsset} userList={userList} />
        </div>
      </div>
    </div>
  );
}
