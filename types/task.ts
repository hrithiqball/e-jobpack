import { fetchTaskList } from '@/lib/actions/task';

export type TaskList = Awaited<ReturnType<typeof fetchTaskList>>;
export type TaskItem = Awaited<ReturnType<typeof fetchTaskList>>[0];
