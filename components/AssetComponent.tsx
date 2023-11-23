"use client";

import { ExtendedAsset } from "@/app/asset/page";
import { Button, Card } from "@nextui-org/react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { asset } from "@prisma/client";

function AssetComponent({ extendedAsset }: { extendedAsset: asset[] }) {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const title: string =
		extendedAsset == undefined ? "No title" : extendedAsset[0].name;

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return <Loading label="Hang on tight" />;

	return (
		<Card
			className={`rounded-md p-4 m-4 flex-grow ${
				theme === "dark" ? "bg-gray-800" : "bg-gray-200"
			}`}
		>
			<div>
				<p>{title}</p>
			</div>
		</Card>
	);
}

export default AssetComponent;
