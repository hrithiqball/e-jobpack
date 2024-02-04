import AssetItemComponent from '@/components/asset/AssetItemComponent';
import { fetchMaintenanceList } from '@/lib/actions/maintenance';
import { fetchMutatedAssetItem } from '@/lib/actions/asset';
import { fetchUserList } from '@/lib/actions/user';
import { fetchAssetStatusList } from '@/lib/actions/asset-status';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';

interface AssetItemPageProps {
  params: { id: string };
}

export default async function AssetItemPage({ params }: AssetItemPageProps) {
  const mutatedAsset = await fetchMutatedAssetItem(params.id);
  const statusList = await fetchAssetStatusList();
  const typeList = await fetchAssetTypeList();
  const maintenanceList = await fetchMaintenanceList(params.id);
  const userList = await fetchUserList();

  return (
    <div className="flex flex-1 flex-col">
      <AssetItemComponent
        mutatedAsset={mutatedAsset}
        statusList={statusList}
        typeList={typeList}
        maintenanceList={maintenanceList}
        userList={userList}
      />
    </div>
  );
}
