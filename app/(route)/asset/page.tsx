import { fetchAssetList } from '@/app/api/server-actions';
import AssetComponent from '@/components/client/AssetList';
import Navigation from '@/components/client/Navigation';

export default async function AssetPage() {
  const assetList = await fetchAssetList();

  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <AssetComponent assetList={assetList} />
    </div>
  );
}
