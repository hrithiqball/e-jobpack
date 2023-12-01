"use server";
import { user } from "@prisma/client";
import { Result } from "../result";
import { createClient } from "../supabase/server";
import { cookies } from "next/headers";
import { MetadataUser } from "@/model/user";

export async function ReadUserSession() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	return supabase.auth.getSession();
}

export async function ReadUserInfo() {
	try {
		const origin = process.env.NEXT_PUBLIC_ORIGIN;
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
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
					role: result.data.role ?? "maintainer",
					department: result.data.department ?? "management",
					email: data.user.email,
					userId: data.user.id,
				};

				return userInfo;
			} else {
				console.error("User not found");
				return null;
			}
		} else {
			console.error("User not found");
			return null;
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
}
