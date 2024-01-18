import AssetItemComponent from '@/components/asset/AssetItemComponent';
import { fetchMaintenanceList } from '@/lib/actions/maintenance';
import { fetchChecklistUseList } from '@/lib/actions/checklist-use';
import { fetchAssetItem, fetchMutatedAssetItem } from '@/lib/actions/asset';
import { fetchUserList } from '@/lib/actions/user';

export default async function AssetItemPage({
  params,
}: {
  params: { id: string };
}) {
  const maintenanceList = await fetchMaintenanceList(params.id);
  const checklistUse = await fetchChecklistUseList(params.id);
  const asset = await fetchAssetItem(params.id);
  const mutatedAsset = await fetchMutatedAssetItem(params.id);
  const userList = await fetchUserList();

  return (
    <div className="flex flex-col flex-1">
      <AssetItemComponent
        mutatedAsset={mutatedAsset}
        asset={asset}
        maintenanceList={maintenanceList}
        checklistUse={checklistUse}
        userList={userList}
      />
    </div>
  );
}
