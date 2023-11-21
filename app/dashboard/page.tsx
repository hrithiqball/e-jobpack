"use client";

import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import NavigationDashboard from "../components/DashboardNavigation";
import { Card } from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function Dashboard() {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div>
			<Navigation />
			<Card
				className={`rounded-md p-4 m-4 flex-grow ${
					theme === "dark" ? "bg-gray-800" : "bg-gray-200"
				}`}
			>
				<NavigationDashboard />
			</Card>
		</div>
	);
}
