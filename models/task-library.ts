import { z } from "zod";

export interface TaskLibrary {
	uid: string;
	created_on: Date;
	created_by: string;
	updated_on: Date;
	updated_by: string;
	task: string;
	description?: string;
}
