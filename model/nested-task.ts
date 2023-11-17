import { AddSubtaskUseClient } from "@/app/api/subtask-use/route";
import { AddTaskUseClient } from "@/app/api/task-use/route";
import { subtask_use, task_use } from "@prisma/client";

export interface NestedTask {
	taskUse: AddTaskUseClient;
	subtaskUse?: AddSubtaskUseClient[];
}

export interface NestedTaskServer {
	taskUse: task_use;
	subtaskUse?: subtask_use[];
}
