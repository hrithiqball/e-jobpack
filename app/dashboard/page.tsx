import Navigation from "../../components/Navigation";
import SignOutItem from "@/components/SignOutItem";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { User } from "@supabase/supabase-js";
import Dashboard from "@/components/Dashboard";

export type MetadataUser = User & {
	name: string | undefined;
	role: string | undefined;
	department: string | undefined;
	userId: string | undefined;
};

export default async function DashboardPage() {
	const supabase = createClient(cookies());
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const userInfo: MetadataUser | null = user && {
		...user,
		name: user.user_metadata.name ?? ("Harith Iqbal" as string),
		role: user.user_metadata.role as string,
		department: user.user_metadata.department as string,
		email: user.email,
		userId: user.id,
	};

	return (
		<div className="flex flex-col h-screen">
			<Navigation user2={userInfo}>
				<SignOutItem />
			</Navigation>
			<Dashboard />
		</div>
	);
}
