"use client";

import { Result } from "@/lib/result";
import { asset } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "@nextui-org/button";

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
		<div className="bg-emeraldGreenDark max-w mx-auto p-6">
			<h1 className="text-3xl font-bold underline">Assets</h1>

			<article className="prose py-4">
				<h1>Garlic bread with cheese: What the science tells us</h1>
				<p>
					For years parents have espoused the health benefits of eating garlic
					bread with cheese to their children, with the food earning such an
					iconic status in our culture that kids will often dress up as warm,
					cheesy loaf for Halloween.
				</p>
				<p>
					But a recent study shows that the celebrated appetizer may be linked
					to a series of rabies cases springing up around the country.
				</p>
			</article>

			<Button
				color="primary"
				radius="sm"
				onClick={fetchData}
				disabled={isLoading}
			>
				{isLoading ? "Loading..." : "Fetch Assets"}
			</Button>

			<ul>
				{asset.map((asset) => (
					<li key={asset.uid}>{asset.name}</li>
				))}
			</ul>
		</div>
	);
}
