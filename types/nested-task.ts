import { AddSubtaskUseClient } from '@/app/api/subtask-use/route';
import { AddTaskUseClient } from '@/app/api/task-use/route';
import { SubtaskUse, TaskUse } from '@prisma/client';

export interface NestedTask {
  taskUse: AddTaskUseClient;
  subtaskUse?: AddSubtaskUseClient[];
}

export interface NestedTaskServer {
  taskUse: TaskUse;
  subtaskUse?: SubtaskUse[];
}
