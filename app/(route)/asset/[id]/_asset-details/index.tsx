import { AssetStatus, AssetType, User } from '@prisma/client';

import { MutatedAsset } from '@/types/asset';

import DetailsWidget from './DetailsWidget';
import TeamWidget from './TeamWidget';
import ChecklistWidget from './ChecklistWidget';
import MaintenanceWidget from './MaintenanceWidget';

type AssetDetailsProps = {
  mutatedAsset: MutatedAsset;
  statusList: AssetStatus[];
  typeList: AssetType[];
  userList: User[];
};

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
      <div className="flex w-1/4 flex-col">
        <div className="flex flex-1 flex-col">
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
