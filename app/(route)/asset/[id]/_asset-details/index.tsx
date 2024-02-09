import { User } from '@prisma/client';

import { MutatedAsset } from '@/types/asset';

import DetailsWidget from './_details-widget';
import TeamWidget from './TeamWidget';
import ChecklistWidget from './ChecklistWidget';
import MaintenanceWidget from './MaintenanceWidget';

type AssetDetailsProps = {
  mutatedAsset: MutatedAsset;
  userList: User[];
};

export default function AssetDetails({
  mutatedAsset,
  userList,
}: AssetDetailsProps) {
  return (
    <div className="flex flex-1">
      <DetailsWidget mutatedAsset={mutatedAsset} />
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
