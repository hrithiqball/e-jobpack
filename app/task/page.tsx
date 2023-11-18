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
} from "@nextui-org/react";
import AddNewTask from "../components/AddNewTask";
import { asset, checklist, maintenance, task } from "@prisma/client";
import { GoIssueDraft } from "react-icons/go";
import { AiOutlineIssuesClose } from "react-icons/ai";

const taskList: task[] = [
	{
		uid: "1",
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
		uid: "2",
		task_activity: "Then this this second task",
		description: "You should remove the green wire",
		is_complete: false,
		remarks: null,
		issue: "string",
		deadline: new Date(),
		completed_by: "string",
		task_order: BigInt(1),
		have_subtask: false,
		checklist_uid: "1",
	},
	{
		uid: "3",
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

function Task() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedTaskMode, setSelectedTaskMode] = useState<string>("My Tasks");

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

	function testMe() {
		console.log(nestedMaintenanceList);
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
						<Button onClick={testMe}>Click me</Button>
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
													<p>{checklist.title}</p>
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
