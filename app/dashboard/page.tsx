"use client";

import { asset } from "@prisma/client";
import React, { useState } from "react";

export default function Dashboard() {
	const [asset, setAsset] = useState<asset[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchData = async () => {
		setIsLoading(true);
		const result = await fetch("/api/asset", { method: "GET" });
		// TODO use standardized response from /lib/result
		const response = await result.json();

		if (result.ok) {
			setAsset(response.data);
			// TODO use message as alert
			console.log(response.message);
			setIsLoading(false);
		} else {
			setIsLoading(false);
			console.log(response.message);
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
