import { z } from "zod";

const UpdateUserSchema = z.object({
	uid: z.string(),
	name: z.string().optional(),
	phone: z.string().optional(),
	password: z.string().min(8).optional(),
	first_page: z.number().optional(),
	enable_dashboard: z.boolean().optional(),
	is_dark_mode: z.boolean().optional(),
});

type UpdateUser = z.infer<typeof UpdateUserSchema> & {
	updated_on: Date;
};
