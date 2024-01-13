import { Asset, Checklist, Maintenance, Task } from '@prisma/client';

export type NestedMaintenance = Maintenance & {
  checklists: NestedChecklist[];
  asset: Asset;
  fileName: string | null;
  loadingReadExcel: boolean;
};

export type NestedChecklist = Checklist & {
  tasks: Task[];
};

export type SimplifiedTask = {
  no: number;
  uid: string;
  taskActivity: string | null;
  remarks: string | null;
  isComplete: string | null;
};
