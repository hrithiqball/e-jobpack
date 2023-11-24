import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AuthButton from "@/components/AuthButton";
import { redirect } from "next/navigation";
import ReadUserSession from "@/lib/actions/route";

export default async function Index() {
	const cookieStore = cookies();

	const initSupabaseClient = () => {
		try {
			createClient(cookieStore);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	};

	const signOut = async () => {
		"use server";

		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		await supabase.auth.signOut();
		return redirect("/");
	};

	const isSupabaseConnected = initSupabaseClient();
	const { data } = await ReadUserSession();

	if (data.session) {
		return redirect("/dashboard");
	}

	return (
		<div className="flex items-center justify-center h-screen">
			{isSupabaseConnected && <AuthButton />}

			<form action={signOut}>
				<button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
					Logout
				</button>
			</form>
		</div>
	);
}
