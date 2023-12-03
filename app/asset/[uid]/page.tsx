import Asset from "@/components/Asset";
import Navigation from "@/components/Navigation";
import SignOutItem from "@/components/SignOutItem";
import {
	ReadUserInfo,
	fetchChecklistUseList,
	fetchMaintenanceList,
} from "@/utils/actions/route";
import { asset } from "@prisma/client";

export default async function AssetItemPage({
	params,
	searchParams,
}: {
	params: { uid: string };
	searchParams: {
		name: string;
		description: string;
		type: string;
		created_by: string;
		created_on: string;
		updated_by: string;
		updated_on: string;
		last_maintenance: string;
		last_maintainee: string[];
		location: string;
		next_maintenance: string;
		status_uid: string;
		person_in_charge: string;
	};
}) {
	// const userInfo = await ReadUserInfo();
	const maintenanceListResult = await fetchMaintenanceList(params.uid);
	const checklistUseResult = await fetchChecklistUseList(params.uid);
	const maintenanceList = maintenanceListResult.data ?? [];
	const checklistUse = checklistUseResult.data ?? [];

	const asset: asset = {
		uid: params.uid,
		name: searchParams.name,
		description: searchParams.description,
		type: searchParams.type,
		created_by: searchParams.created_by,
		created_on: new Date(searchParams.created_on),
		updated_by: searchParams.updated_by,
		updated_on: new Date(searchParams.updated_on),
		last_maintenance: new Date(searchParams.last_maintenance),
		last_maintainee: searchParams.last_maintainee,
		location: searchParams.location,
		next_maintenance: new Date(searchParams.next_maintenance),
		status_uid: searchParams.status_uid,
		person_in_charge: searchParams.person_in_charge,
	};

	return (
		<div className="flex flex-col h-screen">
			{/* <Navigation user={userInfo}>
				<SignOutItem />
			</Navigation> */}
			<Asset
				asset={asset}
				maintenanceList={maintenanceList}
				checklistUse={checklistUse}
			/>
		</div>
	);
}
