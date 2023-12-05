"use client";

import React, { useState, useTransition } from "react";
import { task } from "@prisma/client";
import {
	Button,
	Checkbox,
	Select,
	SelectItem,
	Textarea,
} from "@nextui-org/react";
import { updateTask, updateTaskCompletion } from "@/utils/actions/route";
import { UpdateTask } from "@/app/api/task/[uid]/route";

export default function TaskRow({ task }: { task: task }) {
	let [isPending, startTransition] = useTransition();
	const [taskType, setTaskType] = useState(task.task_type);
	const [selectedSelectOne, setSelectedSelectOne] = useState<string[]>(
		task.task_selected
	);
	const [taskOrder, setTaskOrder] = useState(task.task_order);
	const [taskIsComplete, setTaskIsComplete] = useState(task.is_complete);
	const [taskIssue, setTaskIssue] = useState(task.issue ?? "");

	function updateCompletion(isComplete: boolean) {
		startTransition(() => {
			updateTaskCompletion(task.uid, isComplete);
		});
	}

	function handleSingleSelectionChange(val: any) {
		if ((val.currentKey as string) !== selectedSelectOne[0]) {
			setSelectedSelectOne([val.currentKey as string]);
			const taskUpdate: UpdateTask = {
				task_selected: [val.currentKey as string],
			};

			startTransition(() => {
				updateTask(task.uid, taskUpdate);
			});
		}
		console.log(val.currentKey as string);
	}

	if (taskType === "selectOne") {
		return (
			<div className="flex">
				<Select
					className="max-w-[100]px"
					selectedKeys={selectedSelectOne}
					onSelectionChange={handleSingleSelectionChange}
					size="sm"
					placeholder="Choose one"
				>
					{task.list_choice.map((choice) => (
						<SelectItem key={choice} value={choice}>
							{choice}
						</SelectItem>
					))}
				</Select>
			</div>
		);
	}

	return (
		<div className="flex">
			{/* <span>{taskOrder}</span> */}
			<Checkbox
				isSelected={taskIsComplete}
				onValueChange={() => {
					setTaskIsComplete(!taskIsComplete);
					updateCompletion(!taskIsComplete);
				}}
			>
				{task.task_activity}
			</Checkbox>
			<Textarea
				label="Issue"
				maxRows={1}
				value={taskIssue}
				onValueChange={setTaskIssue}
				className="max-w-xs"
			/>
		</div>
	);
}
