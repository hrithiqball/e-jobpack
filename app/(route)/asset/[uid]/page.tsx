import Asset from '@/components/client/asset/Asset';
import {
  fetchChecklistUseList,
  fetchMaintenanceList,
} from '@/app/api/server-actions';
import { asset } from '@prisma/client';

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

  const asset: asset = {
    uid: params.uid,
    name: searchParams.name,
    description: searchParams.description,
    type: searchParams.type,
    created_by: searchParams.created_by,
    created_on: new Date(searchParams.created_on),
    updated_by: searchParams.updated_by,
    updated_on: new Date(searchParams.updated_on),
    last_maintenance: new Date(searchParams.last_maintenance),
    last_maintainee: searchParams.last_maintainee,
    location: searchParams.location,
    next_maintenance: new Date(searchParams.next_maintenance),
    status_uid: searchParams.status_uid,
    person_in_charge: searchParams.person_in_charge,
    tag: '',
  };

  return (
    <div className="flex flex-col h-full">
      <Asset
        asset={asset}
        maintenanceList={maintenanceList}
        checklistUse={checklistUse}
      />
    </div>
  );
}
