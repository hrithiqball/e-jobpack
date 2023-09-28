"use client";

import { Result } from "@/lib/result";
import { asset } from "@prisma/client";
import React, { useState } from "react";

export default function Dashboard() {
	const [asset, setAsset] = useState<asset[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchData = async () => {
		setIsLoading(true);
		const response: Response = await fetch("/api/asset", { method: "GET" });
		const result: Result<asset[]> = await response.json();

		if (response.status === 200) {
			setAsset(result.data!);
			console.log(result.message);
			setIsLoading(false);
		} else {
			setIsLoading(false);
			console.log(result.message);
		}
	};

	return (
		<div className="bg-emeraldGreenDark text-white">
			<h1 className="text-3xl font-bold underline">Assets</h1>
			<button
				onClick={fetchData}
				disabled={isLoading}
				className={`px-4 py-2 font-semibold text-white transition-colors duration-200 transform rounded-md bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:bg-emerald-600 active:bg-emerald-700 ${
					isLoading ? "cursor-not-allowed" : ""
				}`}
			>
				{isLoading ? "Loading..." : "Fetch Assets"}
			</button>

			<ul>
				{asset.map((asset) => (
					<li key={asset.uid}>{asset.name}</li>
				))}
			</ul>
		</div>
	);
}
