import { readUserInfo, fetchAssetList } from "@/utils/actions/route";
import AssetComponent from "@/components/AssetList";
import SignOutItem from "@/components/SignOutItem";
import Navigation from "@/components/Navigation";

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
