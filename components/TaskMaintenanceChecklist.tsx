"use client";

import { updateTaskCompletion } from "@/utils/actions/route";
import { Card, Checkbox, Divider } from "@nextui-org/react";
import { checklist, maintenance, task } from "@prisma/client";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import React, { useTransition } from "react";

export default function TaskMaintenanceChecklist({
	maintenance,
	checklist,
	taskList,
}: {
	maintenance: maintenance;
	checklist: checklist;
	taskList: task[];
}) {
	let [isPending, startTransition] = useTransition();

	function updateTaskCompletionClient(taskUid: string, isComplete: boolean) {
		startTransition(() => {
			updateTaskCompletion(taskUid, isComplete, maintenance);
		});
	}

	return (
		<Card className="flex-1 h-full p-4">
			<p className="font-bold text-lg">{checklist.title}</p>
			<Divider className="my-4" />
			<div className="flex flex-col space-y-2">
				{taskList.map((task) => (
					<div key={task.uid} className="flex gap-3 items-center">
						<Checkbox
							isSelected={task.is_complete}
							onValueChange={() =>
								updateTaskCompletionClient(task.uid, !task.is_complete)
							}
						>
							<div className="flex flex-row items-center ml-2">
								<MdOutlineSubdirectoryArrowRight />
								<span className="ml-2">{task.task_activity}</span>
							</div>
						</Checkbox>
					</div>
				))}
			</div>
		</Card>
	);
}
