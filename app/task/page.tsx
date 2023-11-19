"use client";

import React, { Key, useState } from "react";
import Navigation from "../components/Navigation";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Tab,
	Tabs,
	useDisclosure,
	Image,
	CardFooter,
	Divider,
	Link,
	Checkbox,
	Input,
} from "@nextui-org/react";
import AddNewTask from "../components/AddNewTask";
import { asset, checklist, maintenance, task } from "@prisma/client";
import { GoIssueDraft } from "react-icons/go";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import Excel from "exceljs";
import { saveAs } from "file-saver";
// import fs from "fs";
import { base64Image } from "@/public/client-icon";
import moment from "moment";

const taskList: task[] = [
	{
		uid: "TK-23487623452523",
		task_activity: "Do this First Task",
		description: null,
		is_complete: true,
		remarks: null,
		issue: null,
		deadline: new Date(),
		completed_by: null,
		task_order: BigInt(1),
		have_subtask: false,
		checklist_uid: "1",
	},
	{
		uid: "TK-2389457692392",
		task_activity: "Then this this second task",
		description: "You should remove the green wire",
		is_complete: false,
		remarks: null,
		issue: "string",
		deadline: new Date(),
		completed_by: "string",
		task_order: BigInt(2),
		have_subtask: false,
		checklist_uid: "1",
	},
	{
		uid: "TK-827426324653253",
		task_activity: "Then this third task",
		description: "string",
		is_complete: false,
		remarks: "string",
		issue: "string",
		deadline: new Date(),
		completed_by: "string",
		task_order: BigInt(1),
		have_subtask: false,
		checklist_uid: "123",
	},
];

const maintenanceList: maintenance[] = [
	{
		uid: "1",
		asset_uid: "1",
		date: new Date(),
		maintainee: null,
		attachment_path: null,
		approved_by: null,
		approved_on: null,
	},
	{
		uid: "13",
		asset_uid: "2",
		date: new Date(),
		maintainee: null,
		attachment_path: null,
		approved_by: null,
		approved_on: null,
	},
];

const checklistList: checklist[] = [
	{
		uid: "1",
		created_on: new Date(),
		created_by: "Harith",
		updated_on: new Date(),
		updated_by: "Harith",
		title: "Manifold Checklist",
		description: null,
		color: null,
		icon: null,
		maintenance_uid: "1",
	},
	{
		uid: "123",
		created_on: new Date(),
		created_by: "Harith",
		updated_on: new Date(),
		updated_by: "Harith",
		title: "Transmitter Checklist",
		description: null,
		color: null,
		icon: null,
		maintenance_uid: "13",
	},
];

const assetList: asset[] = [
	{
		uid: "1",
		name: "Asset 1",
		description: null,
		type: null,
		created_by: "Iqbal",
		created_on: new Date(),
		updated_by: "Iqbal",
		last_maintenance: null,
		last_maintainee: [],
		location: null,
		next_maintenance: null,
		status_uid: null,
		updated_on: new Date(),
		person_in_charge: null,
	},
	{
		uid: "2",
		name: "Asset 2",
		description: null,
		type: null,
		created_by: "Iqbal",
		created_on: new Date(),
		updated_by: "Iqbal",
		last_maintenance: null,
		last_maintainee: [],
		location: null,
		next_maintenance: null,
		status_uid: null,
		updated_on: new Date(),
		person_in_charge: null,
	},
];

type NestedMaintenance = maintenance & {
	checklists: NestedChecklist[];
	asset: asset;
};

type NestedChecklist = checklist & {
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
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedTaskMode, setSelectedTaskMode] = useState<string>("My Tasks");
	const [selectedFile, setSelectedFile] = useState(null);

	const nestedMaintenanceList: NestedMaintenance[] = maintenanceList.map(
		(maintenance: maintenance) => {
			const checklistLists: checklist[] = checklistList.filter(
				(checklist: checklist) => checklist.maintenance_uid === maintenance.uid
			);

			const nestedMaintenance: NestedMaintenance = {
				...maintenance,
				asset: assetList.find(
					(asset: asset) => asset.uid === maintenance.asset_uid
				)!,
				checklists: checklistLists.map((checklist: checklist) => {
					const tasks: task[] = taskList.filter(
						(task: task) => task.checklist_uid === checklist.uid
					);

					return {
						...checklist,
						tasks: tasks,
					};
				}),
			};

			return nestedMaintenance;
		}
	);

	async function exportToExcel(
		checklist: NestedChecklist,
		nestedMaintenance: NestedMaintenance
	) {
		const workbook = new Excel.Workbook();
		const workSheetName = `${nestedMaintenance.asset.name}`;
		const fileName = `Maintenance-${nestedMaintenance.asset.name}-${nestedMaintenance.uid}`;
		const title = `Maintenance for asset ${nestedMaintenance.asset.name}`;
		const columns: Partial<Excel.Column>[] = [
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
				const titleCell: Excel.Cell = worksheet.getCell("A1");
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

				const borderWidth: Partial<Excel.Border> = { style: "thin" };

				for (let index = 8; index <= simplifyTasks.length + 8; index++) {
					worksheet.getRow(index).eachCell((cell: Excel.Cell) => {
						cell.border = {
							top: { style: "thin" },
							left: { style: "thin" },
							bottom: { style: "thin" },
							right: { style: "thin" },
						};
					});
				}

				for (let index = 3; index <= 6; index++) {
					worksheet.getRow(index).eachCell((cell: Excel.Cell) => {
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
		if (selectedFile) {
			const workbook = new Excel.Workbook();
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
				//onFileUpload(sheets);
			};

			reader.readAsArrayBuffer(selectedFile);
			setSelectedFile(null);
		}
	}

	function handleFileChange(event: any) {
		const file = event.target.files[0];
		setSelectedFile(file);
	}

	return (
		<div className="flex flex-col h-screen">
			<Navigation />
			<Card className="rounded-md bg-gray-200 p-4 m-4 flex-grow">
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
						{/* <Button onClick={testMe}>Click me</Button> */}
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
												{nestedMaintenance.asset.name} Maintenance
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
															{task.is_complete ? "Done" : "Not Done"}
														</div>
													))}
												</div>
											)
										)}
									</CardBody>
									<Divider />
									<CardFooter>
										<input type="file" onChange={handleFileChange} />
										<button onClick={importExcel}>Import Excel</button>
									</CardFooter>
								</Card>
							)
						)}
					</div>
				)}
				{selectedTaskMode === "Completed Tasks" && <p>Hello Completed</p>}
				{selectedTaskMode === "Upcoming Tasks" && <p>Hello Upcoming Task</p>}
				{/* <Button
					className="mb-4"
					color="primary"
					variant="shadow"
					onPress={onOpen}
				>
					Assign New Task
				</Button>
				<AddNewTask isOpen={isOpen} onClose={onClose} /> */}
			</Card>
		</div>
	);
}

export default Task;
