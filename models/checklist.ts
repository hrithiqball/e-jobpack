import { z } from "zod";

export interface Checklist {
	uid: string;
	asset_uid: string;
	created_on: Date;
	created_by: string;
	updated_on: Date;
	updated_by: string;
	title: string;
	description?: string;
	color?: string;
	icon?: string;
}
