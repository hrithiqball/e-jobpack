"use client";

import React from "react";
import { Card, Divider } from "@nextui-org/react";
import { checklist } from "@prisma/client";

export default function TaskMaintenanceChecklist({
	checklist,
	children,
}: {
	checklist: checklist;
	children: React.ReactNode;
}) {
	return (
		<Card className="flex-1 h-full p-4">
			<p className="font-bold text-lg">{checklist.title}</p>
			<Divider className="my-4" />
			<div className="flex flex-col space-y-2">{children}</div>
		</Card>
	);
}
