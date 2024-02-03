import { fetchTaskList } from '@/lib/actions/task';
import { fetchTaskLibraryList } from '@/lib/actions/task-library';

export type TaskList = Awaited<ReturnType<typeof fetchTaskList>>;
export type TaskItem = Awaited<ReturnType<typeof fetchTaskList>>[0];

export type TaskLibraryList = Awaited<ReturnType<typeof fetchTaskLibraryList>>;
export type TaskLibraryItem = typeof fetchTaskLibraryList extends () => Promise<
  infer T
>
  ? T extends Array<infer U>
    ? U
    : never
  : never;
