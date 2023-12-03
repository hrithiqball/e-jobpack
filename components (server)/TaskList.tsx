import React, { Fragment } from "react";
import { task } from "@prisma/client";
import TaskItem from "@/components/TaskItem";

export default function TaskList({ taskList }: { taskList: task[] }) {
	return (
		<Fragment>
			{taskList.map((task) => (
				<TaskItem key={task.uid} task={task} />
			))}
		</Fragment>
	);
}
