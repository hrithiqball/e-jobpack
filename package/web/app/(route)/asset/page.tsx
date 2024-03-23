import { fetchAssetStatusList } from '@/data/asset-status.action';
import { fetchAssetTypeList } from '@/data/asset-type.action';
import { fetchAssetList } from '@/data/asset.action';
import { fetchUserList } from '@/data/user.action';

import AssetTable from './_table';

export default async function AssetPage() {
  const userList = await fetchUserList();
  const assetList = await fetchAssetList();
  const assetTypeList = await fetchAssetTypeList();
  const assetStatusList = await fetchAssetStatusList();

  return (
    <div className="flex flex-1 flex-col">
      <AssetTable
        assetList={assetList.filter(asset => !asset.isArchive)}
        assetTypeList={assetTypeList}
        assetStatusList={assetStatusList}
        userList={userList}
      />
    </div>
  );
}
