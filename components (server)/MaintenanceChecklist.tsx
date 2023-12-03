import React, { Fragment } from "react";
import { fetchTaskListByChecklistUid } from "@/utils/actions/route";
import { checklist } from "@prisma/client";
import TaskMaintenanceChecklist from "@/components/TaskMaintenanceChecklist";

export default async function MaintenanceChecklist({
	checklist,
}: {
	checklist: checklist;
}) {
	const taskListResult = await fetchTaskListByChecklistUid(checklist.uid);
	const taskListData = taskListResult.data ?? [];

	return (
		<Fragment>
			<TaskMaintenanceChecklist checklist={checklist} taskList={taskListData} />
		</Fragment>
	);
}
