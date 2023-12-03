import { subtask } from "@prisma/client";
import React from "react";

export default function SubtaskItem({ subtask }: { subtask: subtask }) {
	return <div>{subtask.task_activity}</div>;
}
