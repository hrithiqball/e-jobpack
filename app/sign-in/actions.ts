"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
	try {
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		console.log("1");

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		console.log("2");

		if (error) {
			console.error(error);
			redirect("/sign-in?message=Could not authenticate user");
		}

		console.log("3");

		return redirect("/dashboard");
	} catch (error) {
		console.error(error, "here?");
	}
}
