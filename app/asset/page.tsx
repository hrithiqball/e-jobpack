"use client";

import React, { useState, useEffect } from "react";
import { asset } from "@prisma/client";
import Navigation from "../components/Navigation";
import { Result } from "@/lib/result";
import {
	Card,
	Accordion,
	AccordionItem,
	Skeleton,
	Button,
	useDisclosure,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@nextui-org/react";
import SkeletonList from "../components/SkeletonList";
import AssetMaintenance from "../components/AssetMaintenance";
import { AddAssetClient } from "../api/asset/route";

export default function AssetPage() {
	const [assets, setAssets] = useState<asset[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response: Response = await fetch("/api/asset", { method: "GET" });
				const result: Result<asset[]> = await response.json();

				if (response.status === 200) {
					setAssets(result.data!);
					console.log(result.message);
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
		console.log("fetching data");
	}, []);

	async function addAsset(asset: AddAssetClient) {
		setIsSaving(true);
		try {
			const response: Response = await fetch("/api/asset", {
				method: "POST",
				body: JSON.stringify(asset),
			});
			console.log(response);
			// const result: Result<asset[]> = await response.json();

			// if (response.status === 200) {
			// 	setAssets(result.data!);
			// 	console.log(result.message);
			// } else {
			// 	console.log(result.message);
			// }
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setIsSaving(false);
		}
	}

	const dummy: AddAssetClient = {
		name: "Testing",
		created_by: "USER-230925140418609",
		last_maintainee: [],
		description: null,
		type: null,
		last_maintenance: null,
		next_maintenance: null,
		location: null,
		status_uid: null,
		person_in_charge: null,
	};

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
					Add New Asset
				</Button>
				<Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader>Adding New Asset</ModalHeader>
								<ModalBody>Should be form i think</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
										Action
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
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
							>
								{asset.name} {asset.type}
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
