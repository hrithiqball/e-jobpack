import React from "react";
import { subtask } from "@prisma/client";

export default function SubtaskItem({ subtask }: { subtask: subtask }) {
	return <div>{subtask.task_activity}</div>;
}
