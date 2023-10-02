"use client";

import React from "react";
import Navigation from "../components/Navigation";
import NavigationDashboard from "../components/DashboardNavigation";

export default function Dashboard() {
	return (
		<div>
			<Navigation />
			<NavigationDashboard />
		</div>
	);
}
