import { fetchChecklistList } from '@/data/checklist.action';
import { fetchChecklistLibraryList } from '@/data/checklist-library.action';

export type ChecklistList = Awaited<ReturnType<typeof fetchChecklistList>>;
export type ChecklistLibraryList = Awaited<
  ReturnType<typeof fetchChecklistLibraryList>
>;
export type ChecklistLibraryItem =
  typeof fetchChecklistLibraryList extends () => Promise<infer T>
    ? T extends Array<infer U>
      ? U
      : never
    : never;
