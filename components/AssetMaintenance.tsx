import React from "react";
import { maintenance } from "@prisma/client";

export default function AssetMaintenance({
	maintenanceList,
}: {
	maintenanceList: maintenance[];
}) {
	return (
		<div className="flex flex-grow h-screen p-4">
			AssetMaintenance count is {maintenanceList.length}
		</div>
	);
}
