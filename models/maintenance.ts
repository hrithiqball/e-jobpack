import { z } from "zod";

export interface Maintenance {
	uid: string;
	asset_uid: string;
	date: Date;
	maintainee: string;
	attachment_path?: string;
	approved_by?: string;
	approved_on?: Date;
}
