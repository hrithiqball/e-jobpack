import SubtaskList from "@/server/SubtaskList";
import { fetchSubtaskListByTaskUid } from "@/utils/actions/route";
import { subtask, task } from "@prisma/client";
import React from "react";
import TaskRow from "./TaskRow";

export default async function TaskItem({ task }: { task: task }) {
	let subtaskResult;
	let subtaskData: subtask[] = [];

	if (task.have_subtask) {
		subtaskResult = await fetchSubtaskListByTaskUid(task.uid);
		subtaskData = subtaskResult.data ?? [];
	}

	return (
		<div>
			<TaskRow task={task} />
			{subtaskData.length && <SubtaskList subtaskList={subtaskData} />}
		</div>
	);
}
