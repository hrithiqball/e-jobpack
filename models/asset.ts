import Joi from "joi";
import { z } from "zod";

export interface Asset {
	uid: string;
	type: string;
	status_uid?: string;
	name: string;
	description?: string;
	checklist_uid?: string;
	created_on: Date;
	created_by: string;
	updated_on: Date;
	updated_by: string;
	last_maintenance?: Date;
	next_maintenance?: Date;
	lastMaintainee?: string;
	location?: string;
}

export const uidAsset = z.object({
	uid: z.string().min(3),
});

export const postAssetReq = Joi.object({
	name: Joi.string().required(),
	type: Joi.string().required(),
	description: Joi.string().optional(),
});

export const updateAssetReq = Joi.object({
	uid: Joi.string().required(),
	name: Joi.string().optional(),
	type: Joi.string().optional(),
	description: Joi.string().optional(),
});
