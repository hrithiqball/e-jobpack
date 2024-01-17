import { fetchAssetStatusList } from '@/lib/actions/asset-status';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';
import { fetchMutatedAssetList } from '@/lib/actions/asset';
import { fetchUserList } from '@/lib/actions/user';
import AssetComponent from '@/components/asset/AssetComponent';

export default async function AssetPage() {
  const userList = await fetchUserList();
  const mutatedAssetList = await fetchMutatedAssetList();
  const assetTypeList = await fetchAssetTypeList();
  const assetStatusList = await fetchAssetStatusList();

  return (
    <div className="flex flex-1 flex-col">
      <AssetComponent
        mutatedAssetList={mutatedAssetList}
        assetTypeList={assetTypeList}
        assetStatusList={assetStatusList}
        userList={userList}
      />
    </div>
  );
}
