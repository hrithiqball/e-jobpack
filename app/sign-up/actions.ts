"use server";

import { Result } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";
import { SignUpUser } from "@/model/user";
import { user } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const origin = headers().get("origin");

export async function signUp(newUser: SignUpUser) {
	const supabase = createClient(cookies());

	const { error } = await supabase.auth.signUp({
		email: newUser.email,
		password: newUser.password,
		phone: newUser.phone ?? "",
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
		},
	});

	if (error) {
		console.error(error);
		redirect("/sign-in?message=Could not authenticate user");
	}

	const signUpResult = await signUpUser(newUser.name);
	if (signUpResult.statusCode !== 201) {
		redirect("/sign-in?message=Could not register user");
	}

	return redirect("/sign-in?message=Check email to continue sign in process");
}

async function signUpUser(name: string) {
	try {
		const response: Response = await fetch(`${origin}/api/sign-up`, {
			method: "POST",
			body: JSON.stringify({ name: name }),
		});
		const result: Result<user> = await response.json();

		if (result.statusCode !== 201) {
			console.error(result.message);
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
