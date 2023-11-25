import { Result } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";
import { user } from "@prisma/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function SignUp() {
	const signUpUserDatabase = async (name: string) => {
		"use server";

		try {
			const response: Response = await fetch(
				`${headers().get("origin")}/api/sign-up`,
				{
					method: "POST",
					body: JSON.stringify({ name: name }),
				}
			);
			const result: Result<user> = await response.json();

			if (result.statusCode !== 201) {
				throw new Error(result.message);
			}

			return result;
		} catch (error) {
			throw error;
		}
	};

	const signUp = async (formData: FormData) => {
		"use server";

		const origin = headers().get("origin");
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const phone = formData.get("phone") as string;
		const supabase = createClient(cookies());

		const { error } = await supabase.auth.signUp({
			email,
			password,
			phone: phone ?? "",
			options: {
				emailRedirectTo: `${origin}/auth/callback`,
			},
		});

		if (error) {
			console.error(error);
			return redirect("/sign-in?message=Could not authenticate user");
		}

		const signUpResult = await signUpUserDatabase(name);
		if (signUpResult.statusCode !== 201) {
			return redirect("/sign-in?message=Could not create user");
		}

		return redirect("/sign-in?message=Check email to continue sign in process");
	};

	return (
		<div className="flex items-center justify-center h-screen">
			<Link href="/">Back</Link>
			<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
				<form
					className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
					action={signUp}
				>
					<label className="text-md" htmlFor="name">
						Name
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						name="name"
						required
					/>
					<label className="text-md" htmlFor="email">
						Email
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						name="email"
						required
					/>
					<label className="text-md" htmlFor="phone">
						Phone
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						name="phone"
						required
					/>
					<label className="text-md" htmlFor="password">
						Password
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						type="password"
						name="password"
						required
					/>
					<button
						type="submit"
						className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
					>
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
}
