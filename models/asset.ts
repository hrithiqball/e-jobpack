import { z } from "zod";

export const UidAsset = z.object({
	uid: z.string().min(3),
});

export const AddAssetSchema = z.object({
	name: z.string(),
	description: z.string(),
	type: z.string().nullable(),
	created_by: z.string(),
	last_maintenance: z.date().nullable(),
	next_maintenance: z.date().nullable(),
	last_maintainee: z.array(z.string()),
	location: z.string().nullable(),
	status_uid: z.string().nullable(),
	person_in_charge: z.string().nullable(),
});

export type AddAsset = z.infer<typeof AddAssetSchema> & {
	uid: string;
	updated_on: Date;
	created_on: Date;
	updated_by: string;
};

export const UpdateAssetSchema = z.object({
	uid: z.string(),
	name: z.string().optional(),
	type: z.string().optional(),
	description: z.string().optional(),
});

export type UpdateAsset = z.infer<typeof UpdateAssetSchema>;
