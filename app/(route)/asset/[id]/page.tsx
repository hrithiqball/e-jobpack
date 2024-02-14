import { fetchMaintenanceList } from '@/lib/actions/maintenance';
import { fetchAssetItem } from '@/lib/actions/asset';
import { fetchUserList } from '@/lib/actions/user';
import { fetchAssetStatusList } from '@/lib/actions/asset-status';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';

import AssetItemComponent from './AssetItemComponent';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';

type AssetItemPageProps = {
  params: { id: string };
};

export default async function AssetItemPage({ params }: AssetItemPageProps) {
  const asset = await fetchAssetItem(params.id);
  const assetStatusList = await fetchAssetStatusList();
  const assetTypeList = await fetchAssetTypeList();
  const maintenanceList = await fetchMaintenanceList(params.id);
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
