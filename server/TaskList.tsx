import React, { Fragment } from "react";
import { task } from "@prisma/client";
import TaskItem from "@/components/TaskItem";
import TaskAdd from "@/components/TaskAdd";

export default function TaskList({
	checklistUid,
	taskList,
}: {
	checklistUid: string;
	taskList: task[];
}) {
	return (
		<Fragment>
			{taskList.map((task) => (
				<TaskItem key={task.uid} task={task} />
			))}
			<TaskAdd checklistUid={checklistUid} />
		</Fragment>
	);
}
