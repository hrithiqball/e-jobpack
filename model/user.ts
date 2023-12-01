import { Department, Role } from "@prisma/client";
import { User } from "@supabase/supabase-js";

export type SignUpUser = {
	name: string;
	email: string;
	password: string;
	phone?: string;
};

export type MetadataUser = User & {
	name: string | undefined;
	role: Role;
	department: Department | undefined;
	userId: string | undefined;
};
