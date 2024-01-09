import AssetComponent from '@/components/client/asset/Asset';
import {
  fetchChecklistUseList,
  fetchMaintenanceList,
} from '@/app/api/server-actions';
import { Asset } from '@prisma/client';

export default async function AssetItemPage({
  params,
  searchParams,
}: {
  params: { uid: string };
  searchParams: {
    name: string;
    description: string;
    type: string;
    created_by: string;
    created_on: string;
    updated_by: string;
    updated_on: string;
    last_maintenance: string;
    last_maintainee: string[];
    location: string;
    next_maintenance: string;
    status_uid: string;
    person_in_charge: string;
  };
}) {
  const maintenanceList = await fetchMaintenanceList(params.uid);
  const checklistUse = await fetchChecklistUseList(params.uid);

  const asset: Asset = {
    uid: params.uid,
    name: searchParams.name,
    description: searchParams.description,
    type: searchParams.type,
    createdBy: searchParams.created_by,
    createdOn: new Date(searchParams.created_on),
    updatedBy: searchParams.updated_by,
    updatedOn: new Date(searchParams.updated_on),
    lastMaintenance: new Date(searchParams.last_maintenance),
    lastMaintainee: searchParams.last_maintainee,
    location: searchParams.location,
    nextMaintenance: new Date(searchParams.next_maintenance),
    statusId: searchParams.status_uid,
    personInCharge: searchParams.person_in_charge,
    tag: '',
  };

  return (
    <div className="flex flex-col h-full">
      <AssetComponent
        asset={asset}
        maintenanceList={maintenanceList}
        checklistUse={checklistUse}
      />
    </div>
  );
}
