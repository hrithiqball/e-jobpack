import {
  fetchMaintenanceItem,
  fetchMaintenanceList,
} from '@/lib/actions/maintenance';
import { fetchMaintenanceLibraryList } from '@/lib/actions/maintenance-library';

export type Maintenance = Awaited<ReturnType<typeof fetchMaintenanceItem>>;
export type MaintenanceList = Awaited<ReturnType<typeof fetchMaintenanceList>>;

export type MaintenanceLibraryList = Awaited<
  ReturnType<typeof fetchMaintenanceLibraryList>
>;

export type MaintenanceItem = typeof fetchMaintenanceList extends () => Promise<
  infer T
>
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
