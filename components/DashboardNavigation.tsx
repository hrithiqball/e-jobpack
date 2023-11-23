import React, { Key, useState } from "react";
import Overview from "./Overview";
import Report from "./Report";
import Calendar from "./Calendar";
import { Button } from "@nextui-org/button";
import { ButtonGroup, Tab, Tabs } from "@nextui-org/react";
import { BsCalendarRangeFill } from "react-icons/bs";

const NavigationDashboard = () => {
	const [activeComponent, setActiveComponent] = useState("overview");

	const renderComponent = () => {
		switch (activeComponent) {
			case "overview":
				return <Overview />;
			case "report":
				return <Report />;
			case "calendar":
				return <Calendar />;
			default:
				return null;
		}
	};

	return (
		<div>
			<Tabs
				radius="md"
				color="primary"
				aria-label="Tabs radius"
				onSelectionChange={(key: Key) => setActiveComponent(key as string)}
			>
				<Tab key="overview" title="Overview" />
				<Tab key="report" title="Report" />
				<Tab key="calendar" title="Calendar" />
			</Tabs>
			{renderComponent()}
			{/* <div className="flex space-x-4">
				<ButtonGroup className="m-4">
					<Button
						variant="ghost"
						onClick={() => setActiveComponent("overview")}
						className={
							activeComponent === "overview"
								? "bg-[var(--emerald-green-light)] text-white"
								: ""
						}
					>
						Overview
					</Button>
					<Button
						variant="ghost"
						onClick={() => setActiveComponent("report")}
						className={
							activeComponent === "report"
								? "bg-[var(--emerald-green-light)] text-white"
								: ""
						}
					>
						Report
					</Button>
					<Button
						variant="ghost"
						onClick={() => setActiveComponent("calendar")}
						className={
							activeComponent === "calendar"
								? "bg-[var(--emerald-green-light)] text-white"
								: ""
						}
					>
						Calendar
					</Button>
				</ButtonGroup>
			</div>
			{renderComponent()} */}
		</div>
	);
};

export default NavigationDashboard;
