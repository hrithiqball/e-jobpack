"use client";

import { NestedMaintenance } from "@/app/task/page";
import React from "react";

function TaskComponent({
	nestedMaintenance,
}: {
	nestedMaintenance: NestedMaintenance[];
}) {
	const test: NestedMaintenance = nestedMaintenance[0];

	return (
		<div>
			<span>{test.approved_by}</span>
		</div>
	);
}

export default TaskComponent;
