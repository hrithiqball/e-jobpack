import AssetComponent from '@/components/client/asset/Asset';
import { fetchMaintenanceList } from '@/lib/actions/maintenance';
import { fetchChecklistUseList } from '@/lib/actions/checklist-use';
import { fetchAssetItem } from '@/lib/actions/asset';

export default async function AssetItemPage({
  params,
}: {
  params: { id: string };
}) {
  const maintenanceList = await fetchMaintenanceList(params.id);
  const checklistUse = await fetchChecklistUseList(params.id);
  const asset = await fetchAssetItem(params.id);

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
