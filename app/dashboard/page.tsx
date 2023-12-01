import Navigation from "@/components/Navigation";
import SignOutItem from "@/components/SignOutItem";
import Dashboard from "@/components/Dashboard";
import { ReadUserInfo } from "@/lib/actions/route";

export default async function DashboardPage() {
	const userInfo = await ReadUserInfo();

	return (
		<div className="flex flex-col h-screen">
			<Navigation user={userInfo}>
				<SignOutItem />
			</Navigation>
			<Dashboard />
		</div>
	);
}
