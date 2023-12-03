import { checklist } from "@prisma/client";
import { Fragment } from "react";
import MaintenanceChecklist from "./MaintenanceChecklist";

export default async function MaintenanceChecklistList({
	checklistList,
}: {
	checklistList: checklist[];
}) {
	return (
		<Fragment>
			{checklistList.map((checklist) => (
				<MaintenanceChecklist key={checklist.uid} checklist={checklist} />
			))}
		</Fragment>
	);
}
