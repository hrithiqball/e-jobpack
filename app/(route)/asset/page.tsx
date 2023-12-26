import { fetchAssetList } from '@/app/api/server-actions';
import AssetComponent from '@/components/client/AssetList';

export default async function AssetPage() {
  const assetList = await fetchAssetList();

  return (
    <div className="flex flex-1 flex-col h-full flex-grow">
      <AssetComponent assetList={assetList} />
    </div>
  );
}
