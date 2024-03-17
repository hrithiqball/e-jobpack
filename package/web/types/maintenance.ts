import { TaskType } from '@prisma/client';

import {
  fetchMaintenanceItem,
  fetchMaintenanceList,
} from '@/data/maintenance.action';
import { fetchMaintenanceLibraryList } from '@/data/maintenance-library.action';

export type Maintenance = Awaited<ReturnType<typeof fetchMaintenanceItem>>;
export type Checklist = Maintenance['checklist'][0];
export type MaintenanceList = Awaited<ReturnType<typeof fetchMaintenanceList>>;
export type MaintenanceChecklist = {
  assetId: string;
  taskList:
    | null
    | undefined
    | {
        id: string;
        taskActivity: string;
        description: string | null;
        taskType: TaskType;
        listChoice: string[];
        taskOrder: number;
      }[];
  checklistLibraryId: string | null;
};
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
