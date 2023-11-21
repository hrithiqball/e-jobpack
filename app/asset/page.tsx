"use client";

import React, { useState, useEffect } from "react";
import { asset, checklist, task } from "@prisma/client";
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
	Divider,
	CardFooter,
	Image,
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
import { BiSolidBookAdd } from "react-icons/bi";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
	LiaUserCogSolid,
	LiaUserTieSolid,
	LiaUserLockSolid,
} from "react-icons/lia";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/en-gb";

type OpenCollapsibles = Record<string, boolean>;

export default function AssetPage() {
	const [assets, setAssets] = useState<asset[]>([]);
	const [currentAsset, setCurrentAsset] = useState<asset>();
	const [currentChecklist, setCurrentChecklist] = useState<checklist>();
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [openChecklistModal, setOpenChecklistModal] = useState(false);
	const [openMaintenanceModal, setOpenMaintenanceModal] = useState(false);
	const [openEditAssetModal, setOpenEditAssetModal] = useState(false);
	const [openDeleteAssetModal, setOpenDeleteAssetModal] = useState(false);
	const [testRightSideBar, setTestRightSideBar] = useState(false);
	const [newMaintenance, setNewMaintenance] = useState(false);

	const [openCollapsibles, setOpenCollapsibles] = useState<OpenCollapsibles>(
		{}
	);

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		setIsLoading(true);
	// 		try {
	// 			const response: Response = await fetch("/api/asset", { method: "GET" });
	// 			const result: Result<asset[]> = await response.json();

	// 			if (response.status === 200) {
	// 				setAssets(result.data!);
	// 			} else {
	// 				console.log(result.message);
	// 			}
	// 		} catch (error) {
	// 			console.error("Error fetching data:", error);
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	};

	// 	fetchData();
	// }, []);
	const dummyData: checklist[] = [
		{
			uid: "1",
			created_by: "1",
			created_on: new Date(),
			updated_by: "1",
			updated_on: new Date(),
			maintenance_uid: "1",
			title: "Checklist A",
			description: "description",
			icon: "electric",
			color: "red",
		},
		{
			uid: "2",
			created_by: "1",
			created_on: new Date(),
			updated_by: "1",
			updated_on: new Date(),
			maintenance_uid: "1",
			title: "title 2",
			description: "description",
			icon: "electric",
			color: "blue",
		},
		{
			uid: "3",
			created_by: "1",
			created_on: new Date(),
			updated_by: "1",
			updated_on: new Date(),
			maintenance_uid: "1",
			title: "title 3",
			description: "description",
			icon: "electric",
			color: "yellow",
		},
		{
			uid: "4",
			created_by: "1",
			created_on: new Date(),
			updated_by: "1",
			updated_on: new Date(),
			maintenance_uid: "1",
			title: "title 4",
			description: "description",
			icon: "electric",
			color: "green",
		},
	];

	const taskList: task[] = [
		{
			uid: "1",
			task_activity: "Do this",
			description: null,
			is_complete: false,
			remarks: null,
			issue: null,
			deadline: null,
			completed_by: null,
			task_order: 1,
			have_subtask: false,
			checklist_uid: "1",
		},
		{
			uid: "2",
			task_activity: "Then that",
			description: null,
			is_complete: false,
			remarks: null,
			issue: null,
			deadline: null,
			completed_by: null,
			task_order: 2,
			have_subtask: false,
			checklist_uid: "1",
		},
		{
			uid: "3",
			task_activity: "then those",
			description: null,
			is_complete: false,
			remarks: null,
			issue: null,
			deadline: null,
			completed_by: null,
			task_order: 3,
			have_subtask: false,
			checklist_uid: "1",
		},
	];

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
				{/* <Button
					onPress={onOpen}
					className="mb-4"
					color="primary"
					variant="shadow"
				>
					<span>Add New Asset</span>
				</Button> */}
				<div className="flex justify-between">
					<span>Asset List</span>
					<Button
						variant="ghost"
						isIconOnly
						size="sm"
						endContent={<BiSolidBookAdd size={25} />}
					></Button>
				</div>
				<div className="flex flex-row justify-between h-screen">
					<div className="flex-1">
						<Button onClick={() => setTestRightSideBar(!testRightSideBar)}>
							Manifold
						</Button>
					</div>
					{testRightSideBar && (
						<div className="bg-gray-300 p-4 flex-1 mt-4 border rounded rounded-md overflow-x-auto">
							<div className="flex flex-row justify-between items-center">
								<span className="font-bold ml-4">Manifold</span>
								<div className="flex flex-row">
									<Button isIconOnly variant="faded">
										<BsFillPersonBadgeFill />
									</Button>
									<Button className="ml-1" isIconOnly variant="faded">
										<AiOutlineEdit />
									</Button>
									<Button className="ml-1" isIconOnly variant="faded">
										<AiOutlinePlusSquare />
									</Button>
								</div>
							</div>
							<Divider className="mt-3" />

							{newMaintenance && currentChecklist && (
								<div className="p-4 h-80 mt-4">
									<span className="font-bold text-lg">
										{currentChecklist.title}
									</span>
									{taskList
										.filter((t) => t.checklist_uid === currentChecklist.uid)
										.map((task, index) => (
											<div key={index} className="mt-2">
												<span className="text-base">
													{index + 1}. {task.task_activity}
												</span>
											</div>
										))}

									<div className="mt-4">
										<LocalizationProvider
											dateAdapter={AdapterMoment}
											adapterLocale="en-gb"
										>
											<DatePicker label="Deadline" />
										</LocalizationProvider>
									</div>

									<Button
										className="mr-4 mt-4"
										color="primary"
										variant="bordered"
										startContent={<LiaUserCogSolid />}
									>
										Assign Maintainer
									</Button>

									<Button
										onClick={() => setNewMaintenance(!newMaintenance)}
										color="primary"
										variant="bordered"
									>
										Create
									</Button>
								</div>
							)}

							{!newMaintenance && (
								<div className="p-4">
									<p>Description</p>
									<p>This is the description of the asset</p>
									<p className="mt-4">Checklist</p>
									<div className="flex flex-row overflow-x-auto items-center">
										{dummyData.map((checklist, index) => (
											<Card
												key={index}
												radius="lg"
												className={`border-none min-h-min min-w-min bg-red-400 mx-2 my-1`}
											>
												<div className="p-4 mb-12">
													<h3 className="text-lg font-semibold">
														{checklist.title}
													</h3>
													<p className="text-tiny text-white/80">
														{checklist.description}
													</p>
												</div>
												<CardFooter className="">
													<Button
														onClick={() => {
															setCurrentChecklist(checklist);
															setNewMaintenance(!newMaintenance);
														}}
														className="text-tiny text-white"
														variant="flat"
														color="default"
														radius="lg"
														size="sm"
													>
														New Maintenance
													</Button>
												</CardFooter>
											</Card>
										))}
										<Button className="min-w-min">Add New Checklist</Button>
									</div>
									<div className="mt-4">
										<p>Scheduled Maintenance</p>
										TODO: Calendar here 12th October
									</div>
									<div className="mt-4">
										<p>Maintenance History</p>
										TODO: Card here
									</div>
								</div>
							)}
						</div>
					)}
				</div>
				{/* <AddAssetForm isOpen={isOpen} onClose={onClose} />
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
				)} */}

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

{
	/* <div className="min-h-400 max-h-400 overflow-y-auto grid grid-cols-1 gap-4">
									<div className=""></div>
									{dummyData.map((checklist, index) => (
										<Card
											key={index}
											isFooterBlurred
											radius="lg"
											className={`border-none min-h-400 bg-${checklist.color}-300`}
										>
											<div className="p-4 mb-12">
												<h3 className="text-lg font-semibold">
													{checklist.title}
												</h3>
												<p className="text-tiny text-white/80">
													{checklist.description}
												</p>
											</div>
											<CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
												<p className="text-tiny text-white/80">
													New Maintenance
												</p>
												<Button
													className="text-tiny text-white bg-black/20"
													variant="flat"
													color="default"
													radius="lg"
													size="sm"
												>
													Notify me
												</Button>
											</CardFooter>
										</Card>
									))}
								</div> */
}
