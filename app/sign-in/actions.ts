"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const supabase = createClient(cookies());

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		redirect("/sign-in?message=Could not authenticate user");
	}

	return redirect("/dashboard");
}
