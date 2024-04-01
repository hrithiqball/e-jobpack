import { getHistories } from '@/data/history.action';

export type Histories = Awaited<ReturnType<typeof getHistories>>;
