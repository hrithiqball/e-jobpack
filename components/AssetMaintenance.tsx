import { maintenance } from "@prisma/client";
import React from "react";

export default function AssetMaintenance({
	maintenanceList,
}: {
	maintenanceList: maintenance[];
}) {
	return <div>AssetMaintenance count is {maintenanceList.length}</div>;
}
