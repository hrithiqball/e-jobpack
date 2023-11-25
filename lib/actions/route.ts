"use server";

import { user } from "@prisma/client";
import { Result } from "../result";
import { createClient } from "../supabase/server";
import { cookies, headers } from "next/headers";
import { MetadataUser } from "@/model/user";

export async function ReadUserSession() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	return supabase.auth.getSession();
}

export async function ReadUserInfo() {
	try {
		const origin = process.env.NEXT_PUBLIC_ORIGIN;
		const supabase = createClient(cookies());
		const { data } = await supabase.auth.getUser();

		if (data.user) {
			const response: Response = await fetch(
				`${origin}/api/user/${data.user.id}`,
				{ method: "GET" }
			);
			const result: Result<user> = await response.json();

			if (result.statusCode !== 200) {
				throw new Error(result.message);
			}

			if (result.data) {
				const userInfo: MetadataUser = {
					...data.user,
					name: result.data.name,
					role: "admin",
					department: "IT",
					email: data.user.email,
					userId: data.user.id,
				};

				return userInfo;
			} else {
				return null;
			}
		} else {
			return null;
		}
	} catch (error) {
		throw error;
	}
}
