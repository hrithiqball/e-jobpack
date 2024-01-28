import { fetchChecklistList } from '@/lib/actions/checklist';

export type ChecklistList = Awaited<ReturnType<typeof fetchChecklistList>>;
