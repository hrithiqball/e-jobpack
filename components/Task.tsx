"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { maintenance, task } from "@prisma/client";
import Loading from "./Loading";
import {
	Button,
	ButtonGroup,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Checkbox,
	Chip,
	Divider,
} from "@nextui-org/react";
import { base64Image } from "@/public/client-icon";
import {
	NestedChecklist,
	NestedMaintenance,
	SimplifiedTask,
} from "@/model/nested-maintenance";
import { AiOutlineCloudSync, AiOutlineIssuesClose } from "react-icons/ai";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import { Border, Cell, Column, Workbook } from "exceljs";
import saveAs from "file-saver";
import moment from "moment";
import Link from "next/link";

export default function Task({
	maintenanceList,
}: {
	maintenanceList: maintenance[];
}) {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [selectedMaintenance, setSelectedMaintenance] =
		useState<NestedMaintenance | null>(null);
	// const [nestedMaintenanceState, setNestedMaintenanceState] = useState<
	// 	NestedMaintenance[]
	// >(nestedMaintenanceList);
	const [selectedFile, setSelectedFile] = useState(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return <Loading label="Hang on tight" />;

	// function handleButtonClick() {
	// 	if (fileInputRef.current) {
	// 		fileInputRef.current.click();
	// 	}
	// }

	// function handleFileChange(event: any) {
	// 	const file = event.target.files[0];

	// 	if (file) {
	// 		setSelectedFile(file);
	// 		if (selectedMaintenance) {
	// 			const updatedNestedMaintenanceList = nestedMaintenanceState.map(
	// 				(nestedMaintenance: NestedMaintenance) => {
	// 					if (nestedMaintenance.uid === selectedMaintenance.uid) {
	// 						return { ...nestedMaintenance, fileName: file.name };
	// 					}
	// 					return nestedMaintenance;
	// 				}
	// 			);

	// 			setNestedMaintenanceState(updatedNestedMaintenanceList);
	// 		}
	// 	}

	// 	setSelectedMaintenance(null);
	// }

	// async function importExcel() {
	// 	if (selectedMaintenance) {
	// 		const updatedNestedMaintenanceList = nestedMaintenanceState.map(
	// 			(nestedMaintenance: NestedMaintenance) => {
	// 				if (nestedMaintenance.uid === selectedMaintenance.uid) {
	// 					return { ...nestedMaintenance, loadingReadExcel: true };
	// 				}
	// 				return nestedMaintenance;
	// 			}
	// 		);

	// 		setNestedMaintenanceState(updatedNestedMaintenanceList);

	// 		if (selectedFile) {
	// 			const workbook = new Workbook();
	// 			const reader = new FileReader();

	// 			reader.onload = async (event: any) => {
	// 				const buffer = event.target.result;
	// 				await workbook.xlsx.load(buffer);
	// 				const sheets = workbook.worksheets[0];

	// 				let simplifiedTask: SimplifiedTask[] = [];

	// 				for (let index = 9; index <= sheets.rowCount; index++) {
	// 					const row = sheets.getRow(index);

	// 					const task: SimplifiedTask = {
	// 						no: row.getCell(1).value as number,
	// 						uid: row.getCell(2).value as string,
	// 						taskActivity: row.getCell(3).value as string,
	// 						remarks: row.getCell(4).value as string,
	// 						isComplete: row.getCell(5).value as string,
	// 					};

	// 					simplifiedTask.push(task);
	// 				}

	// 				console.log(simplifiedTask);
	// 				setTimeout(() => {
	// 					const updatedNestedMaintenanceList = nestedMaintenanceState.map(
	// 						(nestedMaintenance: NestedMaintenance) => {
	// 							if (nestedMaintenance.uid === selectedMaintenance.uid) {
	// 								return {
	// 									...nestedMaintenance,
	// 									loadingReadExcel: false,
	// 								};
	// 							}
	// 							return nestedMaintenance;
	// 						}
	// 					);

	// 					setNestedMaintenanceState(updatedNestedMaintenanceList);
	// 				}, 3000);

	// 				reader.readAsArrayBuffer(selectedFile);
	// 				setSelectedFile(null);
	// 			};
	// 		} else {
	// 			const updatedNestedMaintenanceList = nestedMaintenanceState.map(
	// 				(nestedMaintenance: NestedMaintenance) => {
	// 					if (nestedMaintenance.uid === selectedMaintenance.uid) {
	// 						return { ...nestedMaintenance, loadingReadExcel: false };
	// 					}
	// 					return nestedMaintenance;
	// 				}
	// 			);

	// 			setNestedMaintenanceState(updatedNestedMaintenanceList);
	// 		}
	// 	}
	// }

	// async function exportToExcel(
	// 	checklist: NestedChecklist,
	// 	maintenance: NestedMaintenance
	// ) {
	// 	const workbook = new Workbook();
	// 	const workSheetName = `${maintenance.asset.name}`;
	// 	const fileName = `Maintenance-${maintenance.asset.name}-${maintenance.uid}`;
	// 	const title = `Maintenance for asset ${maintenance.asset.name}`;
	// 	const columns: Partial<Column>[] = [
	// 		{ key: "no", width: 5 },
	// 		{ key: "uid", width: 20 },
	// 		{ key: "taskActivity", width: 40 },
	// 		{ key: "remarks", width: 20 },
	// 		{ key: "isComplete", width: 13, alignment: { horizontal: "center" } },
	// 	];

	// 	let simplifiedTasks: SimplifiedTask[] = checklist.tasks.map((task) => {
	// 		return {
	// 			no: Number(task.task_order),
	// 			uid: task.uid,
	// 			taskActivity: task.task_activity ?? "",
	// 			remarks: task.remarks ?? "",
	// 			isComplete: task.is_complete ? "/" : "",
	// 		};
	// 	});

	// 	const customSort = (a: SimplifiedTask, b: SimplifiedTask) => a.no - b.no;
	// 	simplifiedTasks = simplifiedTasks.sort(customSort);

	// 	const saveExcel = async () => {
	// 		try {
	// 			const worksheet = workbook.addWorksheet(workSheetName);
	// 			worksheet.columns = columns;

	// 			worksheet.mergeCells("A1:D1");
	// 			// Row 1
	// 			const titleCell: Cell = worksheet.getCell("A1");
	// 			titleCell.value = title;
	// 			titleCell.font = { bold: true, size: 16 };
	// 			titleCell.alignment = {
	// 				horizontal: "center",
	// 				vertical: "middle",
	// 			};

	// 			const imageId = workbook.addImage({
	// 				base64: base64Image,
	// 				extension: "png",
	// 			});
	// 			worksheet.addImage(imageId, {
	// 				tl: { col: 4.99, row: 0.1 },
	// 				ext: { width: 53, height: 55 },
	// 			});
	// 			worksheet.getRow(1).height = 45;

	// 			// Row 3
	// 			worksheet.mergeCells("A3:B3");
	// 			worksheet.mergeCells("C3:E3");
	// 			worksheet.getCell("A3").value = "Date";
	// 			worksheet.getCell("C3").value = moment(maintenance.date).format(
	// 				"DD/MM/YYYY"
	// 			);

	// 			// Row 4
	// 			worksheet.mergeCells("A4:B4");
	// 			worksheet.mergeCells("C4:E4");
	// 			worksheet.getCell("A4").value = "Location";
	// 			worksheet.getCell("C4").value = maintenance.asset.location;

	// 			// Row 5
	// 			worksheet.mergeCells("A5:B5");
	// 			worksheet.mergeCells("C5:E5");
	// 			worksheet.getCell("A5").value = "Tag No.";
	// 			worksheet.getCell("C5").value = maintenance.asset.uid;

	// 			// Row 6
	// 			worksheet.mergeCells("A6:B6");
	// 			worksheet.mergeCells("C6:E6");
	// 			worksheet.getCell("A6").value = "Work Order No.";
	// 			worksheet.getCell("C6").value = 3;

	// 			// Row 7
	// 			worksheet.addRow([]);

	// 			// Row 8
	// 			worksheet.addRow(["No.", "Id", "Task Activity", "Remarks", "Complete"]);
	// 			worksheet.getRow(8).font = { bold: true };

	// 			// Row 9 till end
	// 			simplifiedTasks.forEach((task: SimplifiedTask) => {
	// 				worksheet.addRow(task);
	// 			});

	// 			const borderWidth: Partial<Border> = { style: "thin" };

	// 			for (let index = 8; index <= simplifiedTasks.length + 8; index++) {
	// 				worksheet.getRow(index).eachCell((cell: Cell) => {
	// 					cell.border = {
	// 						top: { style: "thin" },
	// 						left: { style: "thin" },
	// 						bottom: { style: "thin" },
	// 						right: { style: "thin" },
	// 					};
	// 				});
	// 			}

	// 			for (let index = 3; index <= 6; index++) {
	// 				worksheet.getRow(index).eachCell((cell: Cell) => {
	// 					cell.border = {
	// 						top: { style: "thin" },
	// 						left: { style: "thin" },
	// 						bottom: { style: "thin" },
	// 						right: { style: "thin" },
	// 					};
	// 				});
	// 			}

	// 			for (let i = 1; i <= 5; i++) {
	// 				const cell = worksheet.getRow(1).getCell(i);
	// 				cell.border = {
	// 					top: borderWidth,
	// 					bottom: borderWidth,
	// 				};

	// 				if (i === 1) {
	// 					cell.border.left = borderWidth;
	// 				} else if (i === 5) {
	// 					cell.border.right = borderWidth;
	// 				}
	// 			}

	// 			const buf = await workbook.xlsx.writeBuffer();
	// 			saveAs(new Blob([buf]), `${fileName}.xlsx`);
	// 		} catch (error) {
	// 			console.error(error);
	// 		} finally {
	// 			workbook.removeWorksheet(workSheetName);
	// 		}
	// 	};

	// 	await saveExcel();
	// }

	return (
		<Card
			className={`flex rounded-md p-4 m-4 flex-grow ${
				theme === "dark" ? "bg-gray-800" : "bg-gray-200"
			}`}
		>
			<div className="flex flex-col space-y-4 h-full sm:flex-row sm:space-y-0 sm:space-x-4">
				<Card className="flex-1 p-4">
					<div>
						<p className="text-lg font-semibold text-center mb-4">
							My Tasks{" "}
							<Chip size="sm" variant="faded">
								{maintenanceList.length}
							</Chip>
						</p>
						<Divider />
						{maintenanceList.map((maintenance) => (
							<Card key={maintenance.uid} className="w-full my-4">
								<CardHeader className="flex gap-3">
									<Button color="danger" isIconOnly>
										<AiOutlineIssuesClose />
									</Button>
									<div className="flex flex-col">
										<Link
											href={{
												pathname: `/task/${maintenance.uid}`,
												query: {
													maintenance: JSON.stringify(maintenance),
												},
											}}
											className="text-md font-bold"
										>
											{maintenance.uid} Maintenance
										</Link>
										<p className=" text-sm">
											Maintenance ID: {maintenance.uid}
										</p>
										<Link
											className=" text-sm hover:text-blue-500 hover:underline transition-all"
											href={`/asset/${maintenance.asset_uid}`}
										>
											Asset Details
										</Link>
									</div>
								</CardHeader>
								{/* <div className="px-4">
									<Divider />
								</div> */}
								{/* <CardBody>
									{nestedMaintenance.checklists.map(
										(checklist: NestedChecklist) => (
											<div key={checklist.uid}>
												<div className="flex justify-between items-center mb-4">
													<p className="text-md font-semibold">
														{checklist.title}
													</p>
													<div className="flex items-center">
														<Button className="mr-1" variant="ghost" isIconOnly>
															<FaRegFilePdf />
														</Button>
														<Button
															// onClick={() =>
															// 	exportToExcel(checklist, nestedMaintenance)
															// }
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
								</CardBody> */}
								{/* <CardFooter>
									<ButtonGroup>
										<Button
											color="primary"
											variant="ghost"
											startContent={<FaRegFileExcel />}
											onClick={() => {
												// handleButtonClick();
												setSelectedMaintenance(nestedMaintenance);
											}}
										>
											{nestedMaintenance.fileName ?? "Upload Excel"}
										</Button>
										<input
											type="file"
											ref={fileInputRef}
											className="hidden"
											accept=".xlsx, .xls"
											// onChange={handleFileChange}
										/>
										<Button
											color="primary"
											variant="ghost"
											isIconOnly
											isDisabled={!nestedMaintenance.fileName}
											isLoading={nestedMaintenance.loadingReadExcel}
											onClick={() => {
												setSelectedMaintenance(nestedMaintenance);
												// importExcel();
											}}
										>
											{nestedMaintenance.loadingReadExcel ? (
												<Fragment></Fragment>
											) : (
												<AiOutlineCloudSync />
											)}
										</Button>
									</ButtonGroup>
								</CardFooter> */}
							</Card>
						))}
					</div>
				</Card>
				<Card className="flex-1 p-4">
					<div>
						<p className="text-lg font-semibold text-center mb-4">
							Completed Tasks
						</p>
						<Divider />
					</div>
				</Card>
				<Card className="flex-1 p-4">
					<div>
						<p className="text-lg font-semibold text-center mb-4">
							Upcoming Tasks
						</p>
						<Divider />
					</div>
				</Card>
			</div>
		</Card>
	);
}
