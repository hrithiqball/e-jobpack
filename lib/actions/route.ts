"use server";

import { createClient } from "../supabase/server";
import { cookies } from "next/headers";

export default async function ReadUserSession() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	return supabase.auth.getSession();
}
