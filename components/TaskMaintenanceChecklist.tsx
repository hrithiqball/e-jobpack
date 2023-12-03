"use client";

import { Card, Checkbox, Divider } from "@nextui-org/react";
import { checklist, task } from "@prisma/client";
import React from "react";

export default function TaskMaintenanceChecklist({
	checklist,
	taskList,
}: {
	checklist: checklist;
	taskList: task[];
}) {
	return (
		<Card className="flex-1 h-full p-4">
			<p className="font-bold text-lg">{checklist.title}</p>
			<Divider className="my-4" />
			<div className="flex flex-col space-y-2">
				{taskList.map((task) => (
					<div key={task.uid} className="flex gap-3 items-center">
						<Checkbox isSelected={task.is_complete}>
							{task.task_activity}
						</Checkbox>
					</div>
				))}
			</div>
		</Card>
	);
}
