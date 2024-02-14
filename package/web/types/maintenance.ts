import {
  fetchMutatedMaintenanceItem,
  fetchMaintenanceList2,
} from '@/lib/actions/maintenance';
import { fetchMaintenanceLibraryList } from '@/lib/actions/maintenance-library';

export type MutatedMaintenance = Awaited<
  ReturnType<typeof fetchMutatedMaintenanceItem>
>;
export type MaintenanceList = Awaited<ReturnType<typeof fetchMaintenanceList2>>;

export type MaintenanceLibraryList = Awaited<
  ReturnType<typeof fetchMaintenanceLibraryList>
>;

export type MaintenanceItem =
  typeof fetchMaintenanceList2 extends () => Promise<infer T>
    ? T extends Array<infer U>
      ? U
      : never
    : never;

export type MaintenanceLibraryItem =
  typeof fetchMaintenanceLibraryList extends () => Promise<infer T>
    ? T extends Array<infer U>
      ? U
      : never
    : never;
