import { readUserInfo, fetchAssetList } from '@/utils/actions/route';
import AssetComponent from '@/components/client/AssetList';
import SignOutItem from '@/components/client/SignOutItem';
import Navigation from '@/components/client/Navigation';

export default async function AssetPage() {
  const assetResult = await fetchAssetList();
  const assetListData = assetResult.data ?? [];
  const userInfo = await readUserInfo();

  return (
    <div className="flex flex-col h-screen">
      <Navigation user={userInfo}>
        <SignOutItem />
      </Navigation>
      <AssetComponent assetList={assetListData} />
    </div>
  );
}
