import { z } from "zod";

export const SignUpUserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	phone: z.string(),
	password: z.string().min(8),
});

export type SignUpUser = z.infer<typeof SignUpUserSchema> & {
	uid: string;
	first_page: number;
	enable_dashboard: boolean;
	is_dark_mode: boolean;
	created_on: Date;
	updated_on: Date;
};

export const SignInUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export type SignInUser = z.infer<typeof SignInUserSchema>;
