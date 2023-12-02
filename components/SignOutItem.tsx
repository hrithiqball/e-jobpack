import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function SignOutItem() {
	const signOut = async () => {
		"use server";

		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		await supabase.auth.signOut();
		return redirect("/");
	};

	return (
		<form action={signOut}>
			<button className="rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
				Logout
			</button>
		</form>
	);
}
