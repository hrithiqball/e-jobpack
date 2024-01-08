import {
  fetchAssetList,
  fetchAssetTypeList,
  fetchAssetStatusList,
} from '@/app/api/server-actions';
import AssetComponent from '@/components/client/asset/AssetList';

export default async function AssetPage() {
  const assetList = await fetchAssetList();
  const assetTypeList = await fetchAssetTypeList();
  const assetStatusList = await fetchAssetStatusList();

  return (
    <div className="flex flex-1 flex-col h-full flex-grow">
      <AssetComponent
        assetList={assetList}
        assetTypeList={assetTypeList}
        assetStatusList={assetStatusList}
      />
    </div>
  );
}
