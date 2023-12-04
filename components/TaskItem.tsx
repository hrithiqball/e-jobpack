import SubtaskList from "@/server/SubtaskList";
import { fetchSubtaskListByTaskUid } from "@/utils/actions/route";
import { task } from "@prisma/client";
import React from "react";

export default async function TaskItem({ task }: { task: task }) {
	let subtaskResult;
	let subtaskData;

	if (task.have_subtask) {
		subtaskResult = await fetchSubtaskListByTaskUid(task.uid);
		subtaskData = subtaskResult.data ?? [];
	}

	return (
		<div>
			{task.task_activity}
			{subtaskData && <SubtaskList subtaskList={subtaskData} />}
		</div>
	);
}
