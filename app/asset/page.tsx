/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, Fragment } from "react";
import { asset, checklist, maintenance, subtask, task } from "@prisma/client";
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
import { useTheme } from "next-themes";
import Loading from "../components/Loading";

type OpenCollapsibles = Record<string, boolean>;

type ExtendedAsset = asset & {
	maintenanceList: ExtendedMaintenance[];
};

type ExtendedMaintenance = maintenance & {
	checklists: ExtendedChecklist[];
};

type ExtendedChecklist = checklist & {
	tasks: ExtendedTask[];
};

type ExtendedTask = task & {
	subtasks: subtask[];
};

export default function AssetPage() {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [extendedAssetList, setExtendedAssetList] = useState<ExtendedAsset[]>(
		[]
	);
	// const [assetList, setAssetList] = useState<asset[]>([]);
	// const [checklistList, setChecklistList] = useState<checklist[]>([]);
	// const [maintenanceList, setMaintenanceList] = useState<maintenance[]>([]);
	// const [taskList, setTaskList] = useState<task[]>([]);
	// const [subtaskList, setSubtaskList] = useState<subtask[]>([]);
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

	const toggleCollapsible = (assetUid: string) => {
		setOpenCollapsibles((prevState: OpenCollapsibles) => ({
			...prevState,
			[assetUid]: !prevState[assetUid],
		}));
	};

	async function fetchAssetList() {
		try {
			const response: Response = await fetch("/api/asset", {
				method: "GET",
			});
			const result: Result<asset[]> = await response.json();

			if (result.statusCode === 200 && result.data != undefined) {
				// setAssetList(result.data);
				await fetchMaintenanceList(result.data);
				return result;
			} else {
				throw new Error(result.message);
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async function fetchMaintenanceList(assetList: asset[]) {
		try {
			console.log(assetList);
			const response: Response = await fetch("/api/maintenance", {
				method: "GET",
			});
			const result: Result<maintenance[]> = await response.json();

			if (result.statusCode === 200) {
				if (result.data != undefined) {
					// setMaintenanceList(result.data);
					await fetchChecklistList(assetList, result.data);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchChecklistList(
		assetList: asset[],
		maintenanceList: maintenance[]
	) {
		try {
			console.log(maintenanceList);
			const response: Response = await fetch("/api/checklist", {
				method: "GET",
			});
			const result: Result<checklist[]> = await response.json();

			if (result.statusCode === 200) {
				if (result.data != undefined) {
					// setChecklistList(result.data);
					await fetchTaskList(assetList, maintenanceList, result.data);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchTaskList(
		assetList: asset[],
		maintenanceList: maintenance[],
		checklistList: checklist[]
	) {
		try {
			console.log(checklistList);
			const response: Response = await fetch("/api/task", {
				method: "GET",
			});
			const result: Result<task[]> = await response.json();

			if (result.statusCode === 200 && result.data != undefined) {
				// setTaskList(result.data);
				await fetchSubtaskList(
					assetList,
					maintenanceList,
					checklistList,
					result.data
				);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchSubtaskList(
		assetList: asset[],
		maintenanceList: maintenance[],
		checklistList: checklist[],
		taskList: task[]
	) {
		try {
			console.log(taskList);
			const response: Response = await fetch("/api/subtask", {
				method: "GET",
			});
			const result: Result<subtask[]> = await response.json();
			console.log(result.statusCode);
			console.log(result.data);

			if (result.statusCode === 200 && result.data != undefined) {
				// setSubtaskList(result.data);

				console.log("hello", result.data);
				const extendedAssetList: ExtendedAsset[] = [];

				assetList.forEach((asset: asset) => {
					let extendedMaintenanceList: ExtendedMaintenance[] = [];

					maintenanceList.forEach((maintenance: maintenance) => {
						if (maintenance.asset_uid !== asset.uid) return;

						let extendedChecklistList: ExtendedChecklist[] = [];
						checklistList.forEach((checklist: checklist) => {
							if (checklist.maintenance_uid !== maintenance.uid) return;

							let extendedTaskList: ExtendedTask[] = [];
							taskList.forEach((task: task) => {
								if (task.checklist_uid !== checklist.uid) return;

								let filterSubtaskList: subtask[] = result.data!.filter(
									(subtask: subtask) => {
										return subtask.task_uid === task.uid;
									}
								);

								if (filterSubtaskList.length) {
									extendedTaskList.push({
										...task,
										subtasks: filterSubtaskList,
									});
								}
							});

							if (extendedTaskList.length) {
								extendedChecklistList.push({
									...checklist,
									tasks: extendedTaskList,
								});
							}
						});

						if (extendedChecklistList.length) {
							extendedMaintenanceList.push({
								...maintenance,
								checklists: extendedChecklistList,
							});
						}
					});

					if (extendedMaintenanceList.length) {
						extendedAssetList.push({
							...asset,
							maintenanceList: extendedMaintenanceList,
						});
					}
				});

				setExtendedAssetList(extendedAssetList);
				// constructExtendedAssetList(
				// 	assetList,
				// 	maintenanceList,
				// 	checklistList,
				// 	taskList,
				// 	result.data
				// );
			}
		} catch (error) {
			console.error(error);
		}
	}

	function constructExtendedAssetList(
		assetList: asset[],
		maintenanceList: maintenance[],
		checklistList: checklist[],
		taskList: task[],
		subtaskList: subtask[]
	) {
		console.log("hello", subtaskList);
		const extendedAssetList: ExtendedAsset[] = [];

		assetList.forEach((asset: asset) => {
			let extendedMaintenanceList: ExtendedMaintenance[] = [];

			maintenanceList.forEach((maintenance: maintenance) => {
				if (maintenance.asset_uid !== asset.uid) return;

				let extendedChecklistList: ExtendedChecklist[] = [];
				checklistList.forEach((checklist: checklist) => {
					if (checklist.maintenance_uid !== maintenance.uid) return;

					let extendedTaskList: ExtendedTask[] = [];
					taskList.forEach((task: task) => {
						if (task.checklist_uid !== checklist.uid) return;

						let filterSubtaskList: subtask[] = subtaskList.filter(
							(subtask: subtask) => {
								return subtask.task_uid === task.uid;
							}
						);

						if (filterSubtaskList.length) {
							extendedTaskList.push({
								...task,
								subtasks: filterSubtaskList,
							});
						}
					});

					if (extendedTaskList.length) {
						extendedChecklistList.push({
							...checklist,
							tasks: extendedTaskList,
						});
					}
				});

				if (extendedChecklistList.length) {
					extendedMaintenanceList.push({
						...maintenance,
						checklists: extendedChecklistList,
					});
				}
			});

			if (extendedMaintenanceList.length) {
				extendedAssetList.push({
					...asset,
					maintenanceList: extendedMaintenanceList,
				});
			}
		});

		setExtendedAssetList(extendedAssetList);
	}

	useEffect(() => {
		fetchAssetList();
		setMounted(true);
	}, []);

	if (!mounted) return <Loading label="Hang on tight" />;

	return (
		<div className="flex flex-col h-screen">
			<Navigation />
			<Card
				className={`rounded-md p-4 m-4 flex-grow ${
					theme === "dark" ? "bg-gray-800" : "bg-gray-200"
				}`}
			>
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
						size="sm"
						endContent={<BiSolidBookAdd size={25} />}
					>
						Add Asset
					</Button>
				</div>
				{extendedAssetList.length > 0 ? (
					<Fragment></Fragment>
				) : (
					<Fragment></Fragment>
				)}
				<div className="flex flex-row justify-between h-screen">
					<div className="flex-1">
						<Button onClick={() => setTestRightSideBar(!testRightSideBar)}>
							Manifold
						</Button>
						<Button onClick={() => console.log(extendedAssetList)}>
							Click Me
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
							{/* 
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
							)} */}

							{/* {!newMaintenance && (
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
							)} */}
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
