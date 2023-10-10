"use client";

import React, { useState, useEffect } from "react";
import { asset } from "@prisma/client";
import Navigation from "../components/Navigation";
import { Result } from "@/lib/result";
import {
	Card,
	Button,
	useDisclosure,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
} from "@nextui-org/react";
import SkeletonList from "../components/SkeletonList";
import AssetMaintenance from "../components/AssetMaintenance";
import AddAssetForm from "../components/AddAssetForm";
import AssetChecklistUse from "../components/AssetChecklistUse";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../components/ui/Collapsible";

type OpenCollapsibles = Record<string, boolean>;

export default function AssetPage() {
	const [assets, setAssets] = useState<asset[]>([]);
	const [currentAsset, setCurrentAsset] = useState<asset>();
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [openChecklistModal, setOpenChecklistModal] = useState(false);
	const [openMaintenanceModal, setOpenMaintenanceModal] = useState(false);
	const [openEditAssetModal, setOpenEditAssetModal] = useState(false);
	const [openDeleteAssetModal, setOpenDeleteAssetModal] = useState(false);

	const [openCollapsibles, setOpenCollapsibles] = useState<OpenCollapsibles>(
		{}
	);

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

	const toggleCollapsible = (assetUid: string) => {
		setOpenCollapsibles((prevState: OpenCollapsibles) => ({
			...prevState,
			[assetUid]: !prevState[assetUid],
		}));
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
					<>
						{/* collapsible will be used only if the asset have tree based. display icon to differentiate */}
						{assets.map((asset) => (
							<Collapsible
								key={asset.uid}
								open={openCollapsibles[asset.uid]}
								onChange={() => toggleCollapsible(asset.uid)}
							>
								<CollapsibleTrigger>
									<Button onPress={() => toggleCollapsible(asset.uid)}>
										{asset.name}
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<Button>View</Button>
									<Button
										onPress={() => {
											setOpenEditAssetModal(true);
										}}
									>
										Edit
									</Button>
									<Button
										onPress={() => {
											setOpenDeleteAssetModal(true);
										}}
									>
										Delete
									</Button>
									<Button
										onPress={() => {
											setOpenChecklistModal(true);
											setCurrentAsset(asset);
										}}
									>
										Checklist
									</Button>
									<Button
										onPress={() => {
											setOpenMaintenanceModal(true);
										}}
									>
										Maintenance
									</Button>
								</CollapsibleContent>
							</Collapsible>
						))}
					</>
				)}

				{currentAsset && (
					<>
						{/* Checklist Modal */}
						<Modal
							backdrop="blur"
							isOpen={openChecklistModal}
							onClose={() => {
								setOpenChecklistModal(false);
							}}
						>
							<ModalContent>
								<ModalHeader>{currentAsset.name} Checklists</ModalHeader>
								<ModalBody>
									<AssetChecklistUse {...currentAsset} />
								</ModalBody>
							</ModalContent>
						</Modal>

						{/* Maintenance Modal */}
						<Modal
							backdrop="blur"
							isOpen={openMaintenanceModal}
							onClose={() => {
								setOpenMaintenanceModal(false);
							}}
						>
							<ModalContent>
								<ModalHeader>{currentAsset.name} Maintenances</ModalHeader>
								<ModalBody>
									<AssetMaintenance {...currentAsset} />
								</ModalBody>
							</ModalContent>
						</Modal>

						{/* Edit Modal */}
						<Modal
							backdrop="blur"
							isOpen={openEditAssetModal}
							onClose={() => {
								setOpenEditAssetModal(false);
							}}
						>
							<ModalContent>
								<ModalHeader>Edit {currentAsset.name}</ModalHeader>
								<ModalBody>{/* TODO: edit asset content */}</ModalBody>
							</ModalContent>
						</Modal>

						{/* Delete Modal */}
						<Modal
							backdrop="blur"
							isOpen={openDeleteAssetModal}
							onClose={() => {
								setOpenDeleteAssetModal(false);
							}}
						>
							<ModalContent>
								<ModalHeader>Edit {currentAsset.name}</ModalHeader>
								<ModalBody>{/* TODO: delete asset content */}</ModalBody>
							</ModalContent>
						</Modal>
					</>
				)}
			</Card>
		</div>
	);
}
