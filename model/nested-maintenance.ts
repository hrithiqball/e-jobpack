import { asset, checklist, maintenance, task } from "@prisma/client";

export type NestedMaintenance = maintenance & {
	checklists: NestedChecklist[];
	asset: asset;
	fileName: string | null;
	loadingReadExcel: boolean;
};

export type NestedChecklist = checklist & {
	tasks: task[];
};

export type SimplifiedTask = {
	no: number;
	uid: string;
	taskActivity: string | null;
	remarks: string | null;
	isComplete: string | null;
};
