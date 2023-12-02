import { asset, checklist, maintenance, subtask, task } from "@prisma/client";
import SignOutItem from "@/components/SignOutItem";
import {
	ReadUserInfo,
	fetchAssetList,
	fetchChecklistList,
	fetchMaintenanceList,
	fetchSubtaskList,
	fetchTaskList,
} from "@/utils/actions/route";
import Task from "@/components/Task";
import { NestedMaintenance } from "@/model/nested-maintenance";
import Navigation from "@/components/Navigation";

function constructNestedMaintenance(
	maintenanceList: maintenance[],
	checklistList: checklist[],
	assetList: asset[],
	taskList: task[],
	subtaskList: subtask[]
): NestedMaintenance[] {
	return maintenanceList.map((maintenance) => {
		const filteredChecklist: checklist[] = checklistList.filter(
			(checklist) => checklist.maintenance_uid === maintenance.uid
		);

		const nestedMaintenance: NestedMaintenance = {
			fileName: null,
			loadingReadExcel: false,
			...maintenance,
			asset: assetList.find((asset) => asset.uid === maintenance.asset_uid)!,
			checklists: filteredChecklist.map((checklist) => {
				const tasks = taskList.filter(
					(task) => task.checklist_uid === checklist.uid
				);

				return {
					...checklist,
					tasks: tasks,
				};
			}),
		};

		return nestedMaintenance;
	});
}

export default async function TaskPage() {
	const maintenanceListResult = fetchMaintenanceList();
	const checklistListResult = fetchChecklistList();
	const assetListResult = fetchAssetList();
	const taskListResult = fetchTaskList();
	const subtaskListResult = fetchSubtaskList();

	const [maintenanceList, checklistList, assetList, taskList, subtaskList] =
		await Promise.all([
			maintenanceListResult,
			checklistListResult,
			assetListResult,
			taskListResult,
			subtaskListResult,
		]);

	const maintenanceListData = maintenanceList.data ?? [];
	const checklistListData = checklistList.data ?? [];
	const assetListData = assetList.data ?? [];
	const taskListData = taskList.data ?? [];
	const subtaskListData = subtaskList.data ?? [];
	const nestedMaintenanceList: NestedMaintenance[] = constructNestedMaintenance(
		maintenanceListData,
		checklistListData,
		assetListData,
		taskListData,
		subtaskListData
	);

	const userInfo = await ReadUserInfo();

	return (
		<div className="flex flex-col h-screen">
			<Navigation user={userInfo}>
				<SignOutItem />
			</Navigation>
			<Task nestedMaintenanceList={nestedMaintenanceList} />
		</div>
	);
}
