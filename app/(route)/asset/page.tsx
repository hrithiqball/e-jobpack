import { readUserInfo, fetchAssetList } from '@/app/api/server-actions';
import AssetComponent from '@/components/client/AssetList';
import SignOutItem from '@/components/client/SignOutItem';
import Navigation from '@/components/client/Navigation';

export default async function AssetPage() {
  const assetList = await fetchAssetList();
  const userInfo = await readUserInfo();

  return (
    <div className="flex flex-col h-screen">
      <Navigation user={userInfo}>
        <SignOutItem />
      </Navigation>
      <AssetComponent assetList={assetList} />
    </div>
  );
}
