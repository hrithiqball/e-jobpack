import { fetchMaintenanceList } from '@/data/maintenance.action';
import { fetchAssetItem } from '@/data/asset.action';
import { fetchUserList } from '@/data/user.action';
import { fetchAssetStatusList } from '@/data/asset-status.action';
import { fetchAssetTypeList } from '@/data/asset-type.action';
import { fetchChecklistLibraryList } from '@/data/checklist-library.action';

import AssetItemComponent from './_component';

type AssetItemPageProps = {
  params: { id: string };
};

export default async function AssetItemPage({ params }: AssetItemPageProps) {
  const asset = await fetchAssetItem(params.id);
  const assetStatusList = await fetchAssetStatusList();
  const assetTypeList = await fetchAssetTypeList();
  const maintenanceList = await fetchMaintenanceList();
  const userList = await fetchUserList();
  const checklistLibrary = await fetchChecklistLibraryList(params.id);

  return (
    <div className="flex flex-1 flex-col">
      <AssetItemComponent
        asset={asset}
        assetStatusList={assetStatusList}
        assetTypeList={assetTypeList}
        maintenanceList={maintenanceList}
        userList={userList}
        checklistLibraryList={checklistLibrary}
      />
    </div>
  );
}
