import React from "react";
import {
	Card,
	Button,
	Input,
	CardHeader,
	Image,
	Divider,
} from "@nextui-org/react";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AuthCard({
	searchParams,
}: {
	searchParams: { message: string };
}) {
	const signIn = async (formData: FormData) => {
		"use server";

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return redirect("/sign-in?message=Could not authenticate user");
		}

		return redirect("/dashboard");
	};

	const signOut = async () => {
		"use server";

		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		await supabase.auth.signOut();
		return redirect("/");
	};

	// const signUp = async (formData: FormData) => {
	// 	"use server";

	// 	const origin = headers().get("origin");
	// 	const email = formData.get("email") as string;
	// 	const password = formData.get("password") as string;
	// 	const cookieStore = cookies();
	// 	const supabase = createClient(cookieStore);

	// 	const { error } = await supabase.auth.signUp({
	// 		email,
	// 		password,
	// 		options: {
	// 			emailRedirectTo: `${origin}/auth/callback`,
	// 		},
	// 	});

	// 	if (error) {
	// 		return redirect("/sign-in?message=Could not authenticate user");
	// 	}

	// 	return redirect("/sign-in?message=Check email to continue sign in process");
	// };

	return (
		// <div className="flex items-center justify-center h-screen">
		// 	<Card title="Login / Sign Up" className="w-64 p-4 shadow-md">
		// 		<CardHeader className="flex gap-3">
		// 			<Image
		// 				alt="Asset Management System"
		// 				height={40}
		// 				radius="sm"
		// 				src="../favicon.ico"
		// 				width={40}
		// 			/>
		// 			<p className="text-md">Asset Management System</p>
		// 		</CardHeader>
		// 		<Divider />
		// 		<form action={signIn}>
		// 			<Input name="email" placeholder="Email" className="mt-4 mb-4" />
		// 			<Input
		// 				name="password"
		// 				type="password"
		// 				placeholder="Password"
		// 				className="mb-4"
		// 			/>
		// 			<Divider />
		// 			<Button type="submit"></Button>
		// 		</form>
		// 		<Button
		// 			as={Link}
		// 			href="/dashboard"
		// 			variant="solid"
		// 			className="w-full mt-4"
		// 		>
		// 			Login
		// 		</Button>
		// 		<Link href="/sign-up" className="text-blue-500 hover:underline mt-4">
		// 			Sign Up
		// 		</Link>
		// 	</Card>
		// </div>
		<div className="flex items-center justify-center h-screen">
			<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
				<form
					className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
					action={signIn}
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
					<button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
						Sign In
					</button>
					<Link href="/sign-up">Sign Up</Link>
					<form action={signOut}>
						<button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
							Logout
						</button>
					</form>
					{/* <button
				formAction={signUp}
				className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
			>
				Sign Up
			</button> */}
				</form>
			</div>
		</div>
	);
}
