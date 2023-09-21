import Joi from "joi";
import { z } from "zod";

export interface Asset {
	uid: string;
	name: string;
	description?: string;
	type: string;
}

export const uidAsset = z.object({
	uid: z.string().min(15),
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
