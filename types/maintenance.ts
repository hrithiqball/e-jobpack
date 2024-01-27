import { fetchMutatedMaintenanceItem } from '@/lib/actions/maintenance';

export type MutatedMaintenance = Awaited<
  ReturnType<typeof fetchMutatedMaintenanceItem>
>;
