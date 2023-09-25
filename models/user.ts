import { z } from "zod";

export const AddUserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(8),
});

export type AddUser = z.infer<typeof AddUserSchema> & {
	uid: string;
	first_page: number;
	enable_dashboard: boolean;
	is_dark_mode: boolean;
};
