"use client";

import React, { useState, useEffect } from "react";
import { asset } from "@prisma/client";
import Navigation from "../components/Navigation";
import { Result } from "@/lib/result";
import {
	Card,
	Accordion,
	AccordionItem,
	Button,
	useDisclosure,
} from "@nextui-org/react";
import SkeletonList from "../components/SkeletonList";
import AssetMaintenance from "../components/AssetMaintenance";
import AddAssetForm from "../components/AddAssetForm";
import AssetChecklist from "../components/AssetChecklistUse";

export default function AssetPage() {
	const [assets, setAssets] = useState<asset[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response: Response = await fetch("/api/asset", { method: "GET" });
				const result: Result<asset[]> = await response.json();

				if (response.status === 200) {
					setAssets(result.data!);
				} else {
					console.log(result.message);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="flex flex-col h-screen">
			<Navigation />
			<Card className="rounded-md bg-gray-200 p-4 m-4 flex-grow">
				<Button
					onPress={onOpen}
					className="mb-4"
					color="primary"
					variant="shadow"
				>
					<span>Add New Asset</span>
				</Button>
				<AddAssetForm isOpen={isOpen} onClose={onClose} />
				{isLoading ? (
					<>
						{Array(6)
							.fill(null)
							.map((_, index) => (
								<SkeletonList key={index} />
							))}
					</>
				) : (
					<Accordion variant="splitted">
						{assets.map((asset) => (
							<AccordionItem
								key={asset.uid}
								aria-label={asset.name}
								title={asset.name}
								className="font-bold"
							>
								<AssetChecklist {...asset} />
								<AssetMaintenance {...asset} />
							</AccordionItem>
						))}
					</Accordion>
				)}
			</Card>
		</div>
	);
}

{
	/* <Button
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
			</ul> */
}
