import { fetchChecklistList } from '@/lib/actions/checklist';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';

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
