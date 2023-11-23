import { maintenance } from "@prisma/client";
import React from "react";

function ChecklistMaintenance(props: maintenance) {
	return <div>{props.uid}</div>;
}

export default ChecklistMaintenance;
