import { Spinner } from "@nextui-org/react";
import React from "react";

function Loading({ label }: { label: string }) {
	return (
		<div className="flex items-center justify-center h-screen">
			<Spinner label={label} color="primary" />
		</div>
	);
}

export default Loading;
