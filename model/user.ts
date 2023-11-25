import { User } from "@supabase/supabase-js";

export type SignUpUser = {
	name: string;
	email: string;
	password: string;
	phone?: string;
};

export type MetadataUser = User & {
	name: string | undefined;
	role: string | undefined;
	department: string | undefined;
	userId: string | undefined;
};
