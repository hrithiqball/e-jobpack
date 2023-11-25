import { createClient } from "@/lib/supabase/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function SignUp() {
	const signUp = async (formData: FormData) => {
		"use server";

		const origin = headers().get("origin");
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const supabase = createClient(cookies());

		const { error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				emailRedirectTo: `${origin}/auth/callback`,
			},
		});

		if (error) {
			console.error(error);
			return redirect("/sign-in?message=Could not authenticate user");
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
					<label className="text-md" htmlFor="email">
						Email
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						name="email"
						placeholder="you@example.com"
						required
					/>
					<label className="text-md" htmlFor="password">
						Password
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						type="password"
						name="password"
						placeholder="••••••••"
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
