import { serverClient } from '@/app/_trpc/serverClient';
import { fetchAssetStatusList } from '@/lib/actions/asset-status';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';
import AssetComponent from '@/components/client/asset/AssetList';

export default async function AssetPage() {
  const assetListTrpc = await serverClient.getAssets();
  const assetTypeList = await fetchAssetTypeList();
  const assetStatusList = await fetchAssetStatusList();

  return (
    <div className="flex flex-1 flex-col h-full flex-grow">
      <AssetComponent
        assetList2={assetListTrpc}
        assetTypeList={assetTypeList}
        assetStatusList={assetStatusList}
      />
    </div>
  );
}
