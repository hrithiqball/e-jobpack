"use client";

import React, { useState, useTransition } from "react";
import { task } from "@prisma/client";
import {
	Button,
	Checkbox,
	Select,
	SelectItem,
	Switch,
	Textarea,
} from "@nextui-org/react";
import { updateTask, updateTaskCompletion } from "@/utils/actions/route";
import { UpdateTask } from "@/app/api/task/[uid]/route";

export default function TaskRow({ task }: { task: task }) {
	let [isPending, startTransition] = useTransition();
	const [taskActivity, setTaskActivity] = useState(task.task_activity);
	const [taskType, setTaskType] = useState(task.task_type);
	const [taskSelected, setTaskSelected] = useState<string[]>(
		task.task_selected
	);
	const [taskBool, setTaskBool] = useState(task.task_bool ?? false);
	const [taskOrder, setTaskOrder] = useState(task.task_order);
	const [taskIsComplete, setTaskIsComplete] = useState(task.is_complete);
	const [taskIssue, setTaskIssue] = useState(task.issue ?? "");

	function handleSelectionChange(val: any) {
		const changedValue = [val.currentKey as string];

		if (
			changedValue.length !== taskSelected.length &&
			changedValue.every((value, index) => value === taskSelected[index])
		) {
			setTaskSelected(changedValue);
			const taskUpdate: UpdateTask = {
				task_selected: changedValue,
			};

			startTransition(() => {
				updateTask(task.uid, taskUpdate);
			});
		}
		console.log(val.currentKey as string);
	}

	function updateTaskClient(taskUpdate: UpdateTask) {
		startTransition(() => {
			updateTask(task.uid, taskUpdate);
		});
	}

	if (taskType === "selectOne" || taskType === "selectMultiple") {
		return (
			<div className="flex">
				<span>{taskActivity}</span>
				<Select
					className="max-w-[100]px"
					selectedKeys={taskSelected}
					selectionMode={taskType === "selectMultiple" ? "multiple" : "single"}
					onSelectionChange={handleSelectionChange}
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

	if (taskType === "choice") {
		return (
			<div className="flex">
				<Switch
					isSelected={taskBool}
					onValueChange={() => {
						setTaskBool(!taskBool);
						const taskUpdate: UpdateTask = {
							task_bool: !taskBool,
						};
						updateTaskClient(taskUpdate);
					}}
				>
					{taskActivity}
				</Switch>
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
					const updateTask: UpdateTask = {
						is_complete: !taskIsComplete,
					};
					updateTaskClient(updateTask);
				}}
			>
				{taskActivity}
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
