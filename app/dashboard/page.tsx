import Navigation from "../../components/Navigation";
import NavigationDashboard from "../../components/DashboardNavigation";
import { Card } from "@nextui-org/react";
import { useTheme } from "next-themes";
import SignOutItem from "@/components/SignOutItem";

export default function Dashboard() {
	return (
		<div>
			<Navigation>
				<SignOutItem />
			</Navigation>
			{/* <form action={signOut}>
				<button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
					Logout
				</button>
			</form> */}
			{/* <Card
				className={`rounded-md p-4 m-4 flex-grow ${
					theme === "dark" ? "bg-gray-800" : "bg-gray-200"
				}`}
			>
				<NavigationDashboard />
			</Card> */}
		</div>
	);
}
