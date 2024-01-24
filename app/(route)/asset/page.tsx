import { fetchAssetStatusList } from '@/lib/actions/asset-status';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';
import { fetchAssetList2 } from '@/lib/actions/asset';
import { fetchUserList } from '@/lib/actions/user';
import AssetComponent from '@/components/asset/AssetComponent';

export default async function AssetPage() {
  const userList = await fetchUserList();
  const assetList = await fetchAssetList2();
  const assetTypeList = await fetchAssetTypeList();
  const assetStatusList = await fetchAssetStatusList();

  return (
    <div className="flex flex-1 flex-col">
      <AssetComponent
        assetList={assetList.filter(asset => !asset.isArchive)}
        assetTypeList={assetTypeList}
        assetStatusList={assetStatusList}
        userList={userList}
      />
    </div>
  );
}
