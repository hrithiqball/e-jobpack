"use client";

import React, { Fragment, useState, useTransition } from "react";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
} from "@nextui-org/react";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import { TaskType, task } from "@prisma/client";
import { createTask } from "@/utils/actions/route";

const selectionChoices: { key: TaskType; value: string }[] = [
	{
		key: "selectOne",
		value: "Single Selection",
	},
	{
		key: "selectMultiple",
		value: "Multiple Selection",
	},
	{
		key: "choice",
		value: "Choice",
	},
	{
		key: "number",
		value: "Number",
	},
	{
		key: "check",
		value: "Check",
	},
];

export default function TaskAdd({ checklistUid }: { checklistUid: string }) {
	let [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);
	const [taskActivity, setTaskActivity] = useState("");
	const [taskDescription, setTaskDescription] = useState("");
	const [selection, setSelection] = useState<TaskType>(TaskType.check);
	const [listCount, setListCount] = useState(1);
	const [choices, setChoices] = useState(Array(listCount).fill(""));

	function handleSelectionChange(val: any) {
		setSelection(val.currentKey as TaskType);
	}

	function handleDeleteChoice(indexToDelete: number) {
		setChoices((prevChoices) => {
			const newChoices = [...prevChoices];
			newChoices.splice(indexToDelete, 1);
			return newChoices;
		});
		setListCount((prevCount) => Math.max(prevCount - 1, 0)); // Ensure count doesn't go below 0
	}

	function handleChoiceChange(index: number, value: string) {
		setChoices((prevChoices) => {
			const newChoices = [...prevChoices];
			newChoices[index] = value;
			return newChoices;
		});
	}

	function handleAddChoice() {
		setListCount((prevCount) => prevCount + 1);
		setChoices((prevChoices) => [...prevChoices, ""]);
	}

	function addTaskClient() {
		const taskAdd: task = {
			uid: `TK-${moment().format("YYMMDDHHmmssSSS")}`,
			checklist_uid: checklistUid,
			task_activity: taskActivity,
			description: taskDescription,
			task_type: TaskType[selection],
			list_choice: choices,
			task_bool: false,
			task_selected: [],
			is_complete: false,
			remarks: "",
			issue: "",
			deadline: null,
			completed_by: null,
			have_subtask: false,
			task_number_val: 0,
			task_check: false,
			task_order: 0,
		};

		startTransition(() => {
			createTask(taskAdd);
		});
	}

	return (
		<div>
			<Button onPress={() => setOpen(!open)}>Add Task</Button>
			<Modal isOpen={open} hideCloseButton backdrop="blur">
				<ModalContent>
					{() => (
						<Fragment>
							<ModalHeader className="flex flex-col gap-1">
								Add New Task
							</ModalHeader>
							<ModalBody>
								<Input
									isRequired
									autoFocus
									label="Activity"
									variant="faded"
									value={taskActivity}
									onValueChange={setTaskActivity}
								/>
								<Input
									label="Description"
									variant="faded"
									value={taskDescription}
									onValueChange={setTaskDescription}
								/>
								<Select
									isRequired
									label="Task Type"
									variant="faded"
									value={selection}
									onSelectionChange={handleSelectionChange}
								>
									{selectionChoices.map((choice) => (
										<SelectItem key={choice.key} value={choice.key}>
											{choice.value}
										</SelectItem>
									))}
								</Select>
								{(selection === "selectOne" ||
									selection === "selectMultiple") && (
									<Fragment>
										{choices.map((choice, index) => (
											<div className="flex items-center" key={index}>
												<Input
													label={`List Choice ${index + 1}`}
													variant="faded"
													value={choice}
													onChange={(e) =>
														handleChoiceChange(index, e.target.value)
													}
												/>
												<Button
													className="ml-2"
													isIconOnly
													onClick={() => handleDeleteChoice(index)}
												>
													<MdDelete />
												</Button>
											</div>
										))}
										<Button onClick={() => handleAddChoice()}>
											Add Choice
										</Button>
									</Fragment>
								)}
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={() => {
										setSelection("check");
										setOpen(!open);
									}}
								>
									Close
								</Button>
								<Button
									isDisabled={
										taskActivity === "" ||
										(selection === "selectOne" && listCount < 2) ||
										(selection === "selectMultiple" && listCount < 2)
									}
									color="primary"
									onPress={() => {
										setSelection("check");
										addTaskClient();
										setOpen(!open);
									}}
								>
									Save
								</Button>
							</ModalFooter>
						</Fragment>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
