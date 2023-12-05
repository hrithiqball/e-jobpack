"use client";

import React, { useState, useTransition } from "react";
import { subtask } from "@prisma/client";
import { updateSubtaskCompletion } from "@/utils/actions/route";
import { Checkbox } from "@nextui-org/react";
import { VscIndent } from "react-icons/vsc";

export default function SubtaskItem({ subtask }: { subtask: subtask }) {
	let [isPending, startTransition] = useTransition();
	const [subtaskIsComplete, setSubtaskIsComplete] = useState(
		subtask.is_complete
	);
	const [subtaskActivity, setSubtaskActivity] = useState(subtask.task_activity);

	function updateCompletion(isComplete: boolean) {
		startTransition(() => {
			updateSubtaskCompletion(subtask.uid, isComplete);
		});
	}

	return (
		<div className="flex items-center">
			<VscIndent />
			<Checkbox
				className="ml-2"
				isSelected={subtaskIsComplete}
				onValueChange={() => {
					setSubtaskIsComplete(!subtaskIsComplete);
					updateCompletion(!subtaskIsComplete);
				}}
			>
				{subtaskActivity}
			</Checkbox>
		</div>
	);
}
