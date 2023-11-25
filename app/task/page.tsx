/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { Key, useEffect, useRef, useState } from "react";
import Navigation from "../../components/Navigation";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Tab,
	Tabs,
	CardFooter,
	Divider,
	Checkbox,
	ButtonGroup,
} from "@nextui-org/react";
import { asset, checklist, maintenance, task } from "@prisma/client";
import TaskComponent from "@/components/TaskComponent";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import { AiOutlineCloudSync } from "react-icons/ai";
import { Workbook, Cell, Column, Border } from "exceljs";
import { saveAs } from "file-saver";
import { base64Image } from "@/public/client-icon";
import moment from "moment";
import { useTheme } from "next-themes";
import { Result } from "@/lib/result";
import Loading from "../../components/Loading";
import SignOutItem from "@/components/SignOutItem";

export type NestedMaintenance = maintenance & {
	checklists: NestedChecklist[];
	asset: asset;
	fileName: string | null;
	loadingReadExcel: boolean;
};

export type NestedChecklist = checklist & {
	tasks: task[];
};

type SimplifiedTask = {
	no: number;
	uid: string;
	taskActivity: string | null;
	remarks: string | null;
	isComplete: string | null;
};

function Task() {
	// return (
	// 	<div className="flex flex-col h-screen">
	// 		<Navigation />
	// 		<TaskComponent nestedMaintenance={nestedMaintenance} />
	// 	</div>
	// )
	const { theme } = useTheme();
	const [selectedTaskMode, setSelectedTaskMode] = useState<string>("My Tasks");
	const [mounted, setMounted] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [selectedMaintenance, setSelectedMaintenance] =
		useState<NestedMaintenance | null>(null);
	const [nestedMaintenanceList, setNestedMaintenanceList] = useState<
		NestedMaintenance[]
	>([]);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		fetchMaintenanceList();
		setMounted(true);
	}, []);

	if (!mounted) return <Loading label="Hang on tight!" />;

	async function fetchMaintenanceList(): Promise<Result<maintenance[]>> {
		try {
			const response: Response = await fetch("/api/maintenance", {
				method: "GET",
			});
			const result: Result<maintenance[]> = await response.json();

			if (result.statusCode === 200) {
				await fetchChecklistList(result.data);
				return result;
			} else {
				console.error(result.message);
				throw new Error(result.message);
			}
		} catch (error) {
			console.error("Error fetching maintenance list", error);
			throw error;
		}
	}

	async function fetchChecklistList(
		maintenanceList: any
	): Promise<Result<checklist[]>> {
		try {
			const response: Response = await fetch("/api/checklist", {
				method: "GET",
			});
			const result: Result<checklist[]> = await response.json();

			if (result.statusCode === 200) {
				await fetchAssetList(maintenanceList, result.data);
				return result;
			} else {
				console.error(result.message);
				throw new Error(result.message);
			}
		} catch (error) {
			console.error("Error fetching maintenance list", error);
			throw error;
		}
	}

	async function fetchAssetList(
		maintenanceList: any,
		checklistList: any
	): Promise<Result<asset[]>> {
		try {
			const response: Response = await fetch("/api/asset", {
				method: "GET",
			});
			const result: Result<asset[]> = await response.json();

			if (result.statusCode === 200) {
				await fetchTaskList(maintenanceList, checklistList, result.data);
				return result;
			} else {
				console.error(result.message);
				throw new Error(result.message);
			}
		} catch (error) {
			console.error("Error fetching maintenance list", error);
			throw error;
		}
	}

	async function fetchTaskList(
		maintenanceList: any,
		checklistList: any,
		assetList: any
	): Promise<Result<task[]>> {
		try {
			const response: Response = await fetch("/api/task", {
				method: "GET",
			});
			const result: Result<task[]> = await response.json();

			if (result.statusCode === 200) {
				const newNestedMaintenanceList: NestedMaintenance[] =
					maintenanceList.map((maintenance: maintenance) => {
						const checklistLists2: checklist[] = checklistList.filter(
							(checklist: checklist) =>
								checklist.maintenance_uid === maintenance.uid
						);

						const nestedMaintenance: NestedMaintenance = {
							fileName: null,
							loadingReadExcel: false,
							...maintenance,
							asset: assetList.find(
								(asset: asset) => asset.uid === maintenance.asset_uid
							)!,
							checklists: checklistLists2.map((checklist: checklist) => {
								const tasks: task[] = result.data!.filter(
									(task: task) => task.checklist_uid === checklist.uid
								);

								return {
									...checklist,
									tasks: tasks,
								};
							}),
						};

						return nestedMaintenance;
					});

				setNestedMaintenanceList(newNestedMaintenanceList);
				return result;
			} else {
				console.error(result.message);
				throw new Error(result.message);
			}
		} catch (error) {
			console.error("Error fetching maintenance list", error);
			throw error;
		}
	}

	function handleButtonClick() {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	}

	async function exportToExcel(
		checklist: NestedChecklist,
		nestedMaintenance: NestedMaintenance
	) {
		const workbook = new Workbook();
		const workSheetName = `${nestedMaintenance.asset.name}`;
		const fileName = `Maintenance-${nestedMaintenance.asset.name}-${nestedMaintenance.uid}`;
		const title = `Maintenance for asset ${nestedMaintenance.asset.name}`;
		const columns: Partial<Column>[] = [
			{ key: "no", width: 5 },
			{ key: "uid", width: 20 },
			{ key: "taskActivity", width: 40 },
			{ key: "remarks", width: 20 },
			{ key: "isComplete", width: 13, alignment: { horizontal: "center" } },
		];

		let simplifyTasks = checklist.tasks.map((task: task) => {
			return {
				no: Number(task.task_order),
				uid: task.uid,
				taskActivity: task.task_activity ?? "",
				remarks: task.remarks ?? "",
				isComplete: task.is_complete ? "/" : "",
			};
		});

		const customSort = (a: SimplifiedTask, b: SimplifiedTask) => a.no - b.no;
		simplifyTasks = simplifyTasks.sort(customSort);

		const saveExcel = async () => {
			try {
				const worksheet = workbook.addWorksheet(workSheetName);
				worksheet.columns = columns;

				worksheet.mergeCells("A1:D1");
				// Row 1
				const titleCell: Cell = worksheet.getCell("A1");
				titleCell.value = title;
				titleCell.font = { bold: true, size: 16 };
				titleCell.alignment = { horizontal: "center", vertical: "middle" };

				const imageId = workbook.addImage({
					base64: base64Image,
					extension: "png",
				});
				worksheet.addImage(imageId, {
					tl: { col: 4.99, row: 0.1 },
					ext: { width: 53, height: 55 },
				});
				worksheet.getRow(1).height = 45;

				// Row 3
				worksheet.mergeCells("A3:B3");
				worksheet.mergeCells("C3:E3");
				worksheet.getCell("A3").value = "Date";
				worksheet.getCell("C3").value = moment(nestedMaintenance.date).format(
					"DD/MM/YYYY"
				);

				// Row 4
				worksheet.mergeCells("A4:B4");
				worksheet.mergeCells("C4:E4");
				worksheet.getCell("A4").value = "Location";
				worksheet.getCell("C4").value = nestedMaintenance.asset.location;

				// Row 5
				worksheet.mergeCells("A5:B5");
				worksheet.mergeCells("C5:E5");
				worksheet.getCell("A5").value = "Tag No.";
				worksheet.getCell("C5").value = nestedMaintenance.asset.uid;

				// Row 6
				worksheet.mergeCells("A6:B6");
				worksheet.mergeCells("C6:E6");
				worksheet.getCell("A6").value = "Work Order No.";
				worksheet.getCell("C6").value = 3;

				// Row 7
				worksheet.addRow([]);

				// Row 8
				worksheet.addRow(["No.", "Id", "Task Activity", "Remarks", "Complete"]);
				worksheet.getRow(8).font = { bold: true };

				// Row 9 till end
				simplifyTasks.forEach((task: SimplifiedTask) => {
					worksheet.addRow(task);
				});

				const borderWidth: Partial<Border> = { style: "thin" };

				for (let index = 8; index <= simplifyTasks.length + 8; index++) {
					worksheet.getRow(index).eachCell((cell: Cell) => {
						cell.border = {
							top: { style: "thin" },
							left: { style: "thin" },
							bottom: { style: "thin" },
							right: { style: "thin" },
						};
					});
				}

				for (let index = 3; index <= 6; index++) {
					worksheet.getRow(index).eachCell((cell: Cell) => {
						cell.border = {
							top: { style: "thin" },
							left: { style: "thin" },
							bottom: { style: "thin" },
							right: { style: "thin" },
						};
					});
				}

				for (let i = 1; i <= 5; i++) {
					const cell = worksheet.getRow(1).getCell(i);
					cell.border = {
						top: borderWidth,
						bottom: borderWidth,
					};

					if (i === 1) {
						cell.border.left = borderWidth;
					} else if (i === 5) {
						cell.border.right = borderWidth;
					}
				}

				const buf = await workbook.xlsx.writeBuffer();
				saveAs(new Blob([buf]), `${fileName}.xlsx`);
			} catch (error: any) {
				console.log(error.message);
			} finally {
				workbook.removeWorksheet(workSheetName);
			}
		};

		await saveExcel();
	}

	async function importExcel() {
		if (selectedMaintenance) {
			const updatedNestedMaintenanceList = nestedMaintenanceList.map(
				(nestedMaintenance: NestedMaintenance) => {
					if (nestedMaintenance.uid === selectedMaintenance.uid) {
						return { ...nestedMaintenance, loadingReadExcel: true };
					}
					return nestedMaintenance;
				}
			);

			setNestedMaintenanceList(updatedNestedMaintenanceList);

			if (selectedFile) {
				const workbook = new Workbook();
				const reader = new FileReader();

				reader.onload = async (event: any) => {
					const buffer = event.target.result;
					await workbook.xlsx.load(buffer);
					const sheets = workbook.worksheets[0];

					let simplifiedChecklist: SimplifiedTask[] = [];

					for (let index = 9; index <= sheets.rowCount; index++) {
						const row = sheets.getRow(index);

						const checklistItem: SimplifiedTask = {
							no: row.getCell(1).value as number,
							uid: row.getCell(2).value as string,
							taskActivity: row.getCell(3).value as string,
							remarks: row.getCell(4).value as string,
							isComplete: row.getCell(5).value as string,
						};

						simplifiedChecklist.push(checklistItem);
					}

					console.log(simplifiedChecklist);
					setTimeout(() => {
						const updatedNestedMaintenanceList = nestedMaintenanceList.map(
							(nestedMaintenance: NestedMaintenance) => {
								if (nestedMaintenance.uid === selectedMaintenance.uid) {
									return { ...nestedMaintenance, loadingReadExcel: false };
								}
								return nestedMaintenance;
							}
						);

						setNestedMaintenanceList(updatedNestedMaintenanceList);
					}, 3000);
					//onFileUpload(sheets);
				};

				reader.readAsArrayBuffer(selectedFile);
				setSelectedFile(null);
			} else {
				const updatedNestedMaintenanceList = nestedMaintenanceList.map(
					(nestedMaintenance: NestedMaintenance) => {
						if (nestedMaintenance.uid === selectedMaintenance.uid) {
							return { ...nestedMaintenance, loadingReadExcel: false };
						}
						return nestedMaintenance;
					}
				);

				setNestedMaintenanceList(updatedNestedMaintenanceList);
			}
		}
	}

	function handleFileChange(event: any) {
		const file = event.target.files[0];

		if (file) {
			setSelectedFile(file);
			if (selectedMaintenance) {
				const updatedNestedMaintenanceList = nestedMaintenanceList.map(
					(nestedMaintenance: NestedMaintenance) => {
						if (nestedMaintenance.uid === selectedMaintenance.uid) {
							return { ...nestedMaintenance, fileName: file.name };
						}
						return nestedMaintenance;
					}
				);

				setNestedMaintenanceList(updatedNestedMaintenanceList);
			}
		}

		setSelectedMaintenance(null);
	}

	return (
		<div className="flex flex-col h-screen">
			<Navigation user2={null}>
				<SignOutItem />
			</Navigation>
			<Card
				className={`rounded-md p-4 m-4 flex-grow ${
					theme === "dark" ? "bg-gray-800" : "bg-gray-200"
				}`}
			>
				<Tabs
					radius="md"
					color="primary"
					aria-label="Tabs radius"
					onSelectionChange={(key: Key) => setSelectedTaskMode(key as string)}
				>
					<Tab key="My Tasks" title="My Tasks" />
					<Tab key="Completed Tasks" title="Completed Tasks" />
					<Tab key="Upcoming Tasks" title="Upcoming Tasks" />
				</Tabs>
				{selectedTaskMode === "My Tasks" && (
					<div className="py-4">
						{nestedMaintenanceList.map(
							(nestedMaintenance: NestedMaintenance) => (
								<Card
									className="max-w-[400px] my-2"
									key={nestedMaintenance.uid}
								>
									<CardHeader className="flex gap-3">
										<Button color="danger" isIconOnly>
											<AiOutlineIssuesClose />
										</Button>
										<div className="flex flex-col">
											<p className="text-md">
												{nestedMaintenance.asset
													? nestedMaintenance.asset.name
													: "No Asset"}
												Maintenance
											</p>
											<p className="text-small text-default-500">nextui.org</p>
										</div>
									</CardHeader>
									<Divider />
									<CardBody>
										{nestedMaintenance.checklists.map(
											(checklist: NestedChecklist) => (
												<div key={checklist.uid}>
													<div className="flex justify-between items-center">
														<p>{checklist.title}</p>
														<div className="flex items-center">
															<Button
																className="mr-1"
																variant="ghost"
																isIconOnly
															>
																<FaRegFilePdf />
															</Button>
															<Button
																onClick={() =>
																	exportToExcel(checklist, nestedMaintenance)
																}
																variant="ghost"
																isIconOnly
															>
																<FaRegFileExcel />
															</Button>
														</div>
													</div>
													{checklist.tasks.map((task: task) => (
														<div
															className="flex gap-3 items-center mb-1"
															key={checklist.uid}
														>
															<Checkbox
																isSelected={task.is_complete}
																onValueChange={() => {
																	task.is_complete = !task.is_complete;
																	console.log(task.is_complete);
																}}
															>
																{task.task_activity}
															</Checkbox>
														</div>
													))}
												</div>
											)
										)}
									</CardBody>
									<Divider />
									<CardFooter>
										<ButtonGroup>
											<Button
												color="primary"
												variant="ghost"
												onClick={() => {
													handleButtonClick();
													setSelectedMaintenance(nestedMaintenance);
												}}
												startContent={<FaRegFileExcel />}
											>
												{nestedMaintenance.fileName ?? "Upload Excel"}
											</Button>
											<input
												type="file"
												ref={fileInputRef}
												className="hidden"
												accept=".xlsx, .xls"
												onChange={handleFileChange}
											/>
											<Button
												isIconOnly
												color="primary"
												variant="ghost"
												isDisabled={!nestedMaintenance.fileName}
												isLoading={nestedMaintenance.loadingReadExcel}
												onClick={() => {
													console.log("Clicked");
													setSelectedMaintenance(nestedMaintenance);
													console.log("done update state", selectedMaintenance);
													importExcel();
												}}
											>
												{nestedMaintenance.loadingReadExcel ? (
													<></>
												) : (
													<AiOutlineCloudSync />
												)}
											</Button>
										</ButtonGroup>
									</CardFooter>
								</Card>
							)
						)}
					</div>
				)}
				{selectedTaskMode === "Completed Tasks" && <p>Hello Completed</p>}
				{selectedTaskMode === "Upcoming Tasks" && <p>Hello Upcoming Task</p>}
			</Card>
		</div>
	);
}

// export const getServerSideProps: GetServerSideProps<{ data: NestedMaintenance[] }> = async (
// 	context
// ) => {
// 	// fetching data here
// 	// Return the data as props
// 	return {
// 		props: {
// 			data,
// 		},
// 	};
// };

export default Task;
