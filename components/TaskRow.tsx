"use client";

import React from "react";
import { task } from "@prisma/client";
import { Checkbox } from "@nextui-org/react";

export default function TaskRow({ task }: { task: task }) {
	return (
		<div className="flex">
			<span>{task.task_order}</span>
			<Checkbox isSelected={task.is_complete}>{task.task_activity}</Checkbox>
			<span>{task.remarks}</span>
		</div>
	);
}
