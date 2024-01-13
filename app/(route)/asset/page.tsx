import { fetchAssetList } from '@/lib/actions/asset';
import { fetchAssetStatusList } from '@/lib/actions/asset-status';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';
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
