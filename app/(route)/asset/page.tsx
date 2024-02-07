import { fetchAssetStatusList } from '@/lib/actions/asset-status';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';
import { fetchAssetList } from '@/lib/actions/asset';
import { fetchUserList } from '@/lib/actions/user';

import AssetTable from './_asset-table';

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
