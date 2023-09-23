import { z } from "zod";

export interface Task {
	uid: string;
	maintenance_uid: string;
	title: string;
	description?: string;
	task: string;
	is_complete: boolean;
	remarks?: string;
	issue?: string;
	deadline?: Date;
	completed_by?: string;
	task_order: number;
}
