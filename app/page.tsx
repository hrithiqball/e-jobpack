import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AuthButton from "@/components/AuthButton";

export default function Index() {
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

	const isSupabaseConnected = initSupabaseClient();

	return (
		<div className="flex items-center justify-center h-screen">
			{isSupabaseConnected && <AuthButton />}
		</div>
	);
}
