import AssetItemComponent from '@/components/client/asset/AssetItemComponent';
import { fetchMaintenanceList } from '@/lib/actions/maintenance';
import { fetchChecklistUseList } from '@/lib/actions/checklist-use';
import { fetchAssetItem } from '@/lib/actions/asset';
import { fetchUserList } from '@/lib/actions/user';

export default async function AssetItemPage({
  params,
}: {
  params: { id: string };
}) {
  const maintenanceList = await fetchMaintenanceList(params.id);
  const checklistUse = await fetchChecklistUseList(params.id);
  const asset = await fetchAssetItem(params.id);
  const userList = await fetchUserList();

  return (
    <div className="flex flex-col flex-1 h-full">
      <AssetItemComponent
        asset={asset}
        maintenanceList={maintenanceList}
        checklistUse={checklistUse}
        userList={userList}
      />
    </div>
  );
}
