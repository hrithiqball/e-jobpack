import { fetchAssetStatusList } from '@/lib/actions/asset-status';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';
import AssetComponent from '@/components/client/asset/AssetList';
import { fetchMutatedAssetList } from '@/lib/actions/asset';

export default async function AssetPage() {
  const mutatedAssetList = await fetchMutatedAssetList();
  const assetTypeList = await fetchAssetTypeList();
  const assetStatusList = await fetchAssetStatusList();

  return (
    <div className="flex flex-1 flex-col h-full flex-grow">
      <AssetComponent
        mutatedAssetList={mutatedAssetList}
        assetTypeList={assetTypeList}
        assetStatusList={assetStatusList}
      />
    </div>
  );
}
