import { maintenance } from "@prisma/client";
import React from "react";

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
