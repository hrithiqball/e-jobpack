import AssetComponent from '@/components/client/asset/Asset';
import { fetchMaintenanceList } from '@/lib/actions/maintenance';
import { fetchChecklistUseList } from '@/lib/actions/checklist-use';
import { fetchAssetItem } from '@/lib/actions/asset';

export default async function AssetItemPage({
  params,
}: {
  params: { uid: string };
}) {
  const maintenanceList = await fetchMaintenanceList(params.uid);
  const checklistUse = await fetchChecklistUseList(params.uid);
  const asset = await fetchAssetItem(params.uid);

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
