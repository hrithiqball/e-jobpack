import { User } from '@prisma/client';

import DetailsWidget from './_details-widget';
import TeamWidget from './TeamWidget';
import ChecklistWidget from './ChecklistWidget';
import MaintenanceWidget from './MaintenanceWidget';

type AssetDetailsProps = {
  userList: User[];
};

export default function AssetDetails({ userList }: AssetDetailsProps) {
  return (
    <div className="flex flex-1">
      <DetailsWidget />
      <div className="flex w-1/4 flex-col">
        <div className="flex flex-1 flex-col">
          <TeamWidget />
          <ChecklistWidget />
          <MaintenanceWidget userList={userList} />
        </div>
      </div>
    </div>
  );
}
