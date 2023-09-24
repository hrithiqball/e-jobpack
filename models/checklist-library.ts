import { z } from "zod";

export interface ChecklistLibrary {
	uid: string;
	created_on: Date;
	created_by: string;
	updated_on: Date;
	updated_by: string;
	title: string;
	description?: string;
	icon?: string;
	color?: string;
}
