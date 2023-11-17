import { Button, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { asset, checklist_use, subtask_use, task_use } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { Result } from "@/lib/result";
import { useForm } from "react-hook-form";
import { AddChecklistUseClient } from "../api/checklist-use/route";
import { IconChoice, iconChoice } from "@/public/icon-choice";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/Collapsible";
import { AddTaskUseClient, AddTaskUseServer } from "../api/task-use/route";
import {
	AddSubtaskUseClient,
	AddSubtaskUseServer,
} from "../api/subtask-use/route";
import { NestedTask } from "@/model/nested-task";

function AddNewChecklistUse(props: {
	asset: asset;
	onCloseModal: (checklistUse?: checklist_use) => void;
}) {
	const [isSaving, setIsSaving] = useState(false);
	const [tasks, setTasks] = useState<NestedTask[]>([]);
	const [subtasks, setSubtasks] = useState<AddSubtaskUseClient[]>([]);
	const [isTaskAdded, setIsTaskAdded] = useState<boolean>(false);
	const [isSubtaskAdded, setIsSubtaskAdded] = useState<boolean>(false);
	const [taskUseLibraryUid, setTaskUseLibraryUid] = useState<
		string | undefined
	>("");
	const [subtaskUseLibraryUid, setSubtaskUseLibraryUid] = useState<
		string | undefined
	>("");
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<AddChecklistUseClient>({
		defaultValues: {
			title: "",
			description: "",
			icon: "",
		},
	});

	const taskActivityRef = useRef<HTMLInputElement | null>(null);
	const taskDescriptionRef = useRef<HTMLInputElement | null>(null);

	const subtaskActivityRef = useRef<HTMLInputElement | null>(null);
	const subtaskDescriptionRef = useRef<HTMLInputElement | null>(null);

	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		console.log(errors.title?.message);
	// 	}, 5000);

	// 	return () => clearInterval(interval);
	// }, [errors.title?.message]);

	async function onSubmit(data: AddChecklistUseClient) {
		setIsSaving(true);
		const newChecklistUse: AddChecklistUseClient = {
			title: data.title,
			asset_uid: props.asset.uid,
			description: data.description,
			icon: data.icon,
			created_by: "USER-1",
		};

		try {
			const response: Response = await fetch("/api/checklist-use", {
				method: "POST",
				body: JSON.stringify(newChecklistUse),
			});
			const result: Result<checklist_use> = await response.json();

			if (result.statusCode === 201) {
				const checklistUse = result.data!;
				tasks.forEach(async (task: NestedTask) => {
					const taskUse = await submitTasks(checklistUse, task.taskUse);
					if (task.subtaskUse && taskUse) {
						task.subtaskUse.forEach(async (subtaskUse: AddSubtaskUseClient) => {
							await submitSubtasks(taskUse, subtaskUse);
						});
					}
				});
				props.onCloseModal(checklistUse);
			} else {
				console.error(result.message);
			}
		} catch (error) {
			console.error("Error create new checklist", error);
		} finally {
			setTimeout(() => {
				setIsSaving(false);
			}, 4000);
		}
	}

	async function submitTasks(
		checklistUse: checklist_use,
		taskUse: AddTaskUseClient
	) {
		try {
			const taskUseRequest: AddTaskUseServer = {
				...taskUse,
				checklist_use_uid: checklistUse.uid,
			};

			const response: Response = await fetch("/api/task-use", {
				method: "POST",
				body: JSON.stringify(taskUseRequest),
			});
			const result: Result<task_use> = await response.json();

			if (result.statusCode === 201) {
				return result.data!;
			} else {
				return;
			}
		} catch (error) {
			console.error("Error create new task", error);
		}
	}

	async function submitSubtasks(
		taskUse: task_use,
		subtaskUse: AddSubtaskUseClient
	) {
		try {
			const subTaskRequest: AddSubtaskUseServer = {
				...subtaskUse,
				task_use_uid: taskUse.uid,
			};

			const response: Response = await fetch("/api/subtask-use", {
				method: "POST",
				body: JSON.stringify(subTaskRequest),
			});
			const result: Result<subtask_use> = await response.json();

			if (result.statusCode === 201) {
				console.log(result.data);
			} else {
				console.error(result.message);
			}
		} catch (error) {
			console.error(error);
		}
	}

	function handleAddTask() {
		const taskActivity = taskActivityRef.current?.value || "";
		const taskDescription = taskDescriptionRef.current?.value || "";

		let newTask: NestedTask = {
			taskUse: {
				task_activity: taskActivity,
				description: taskDescription,
				task_order: tasks.length + 1,
				have_subtask: subtasks.length > 0 ? true : false,
				// task_library_uid: taskUseLibraryUid,
				task_library_uid: undefined,
			},
		};

		if (subtasks.length > 0) {
			newTask.subtaskUse = subtasks;
		}

		tasks.push(newTask);
		setTaskUseLibraryUid("");

		if (taskActivityRef.current) {
			taskActivityRef.current.value = "";
		}
		if (taskDescriptionRef.current) {
			taskDescriptionRef.current.value = "";
		}

		setIsTaskAdded(false);
		setIsSubtaskAdded(false);
		setSubtasks([]);
	}

	function handleAddSubtask() {
		const subtaskActivity = subtaskActivityRef.current?.value || "";
		const subtaskDescription = subtaskDescriptionRef.current?.value || "";

		let newSubtask: AddSubtaskUseClient = {
			task_activity: subtaskActivity,
			description: subtaskDescription,
			task_order: subtasks.length + 1,
			// subtask_library_uid: subtaskUseLibraryUid,
			subtask_library_uid: undefined,
		};

		subtasks.push(newSubtask);

		if (subtaskActivityRef.current) {
			subtaskActivityRef.current.value = "";
		}
		if (subtaskDescriptionRef.current) {
			subtaskDescriptionRef.current.value = "";
		}

		setIsSubtaskAdded(false);
	}

	return (
		<>
			{isSaving ? (
				<div className="flex flex-col items-center justify-center text-center p-4">
					<Spinner color="success" />
					<span className="ml-2">Saving your new asset</span>
				</div>
			) : (
				<form id="checklistForm" onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4">
						<Input
							isRequired
							label="Title"
							variant="faded"
							{...register("title", { required: "Title is required" })}
							className="w-full"
						/>
						{errors.title?.message && (
							<p className="text-red-500">{errors.title.message}</p>
						)}
					</div>
					<div className="mb-4">
						<Input
							label="Description"
							variant="faded"
							{...register("description")}
							className="w-full"
						/>
					</div>
					<div className="mb-4">
						<Select
							{...register("icon")}
							className="w-full"
							variant="faded"
							label="Icon"
						>
							{iconChoice.map((icon: IconChoice) => (
								<SelectItem key={icon.name} value={icon.name}>
									<div className="flex items-center">
										{React.createElement(icon.icon, {
											size: 20,
											className: "mr-2",
										})}
										{icon.name}
									</div>
								</SelectItem>
							))}
						</Select>
					</div>
					<Collapsible open={isTaskAdded}>
						<CollapsibleTrigger className="w-full">
							<div className="flex justify-between">
								<Button
									variant="ghost"
									className={`${isTaskAdded ? "" : "w-full"} ${
										isTaskAdded ? "mb-4" : ""
									}`}
									onPress={() => {
										setIsTaskAdded(!isTaskAdded);
										setIsSubtaskAdded(false);
									}}
								>
									{isTaskAdded ? "Cancel" : "Add Task"}
								</Button>
								{isTaskAdded && (
									<Button isDisabled={isSubtaskAdded} onPress={handleAddTask}>
										Add
									</Button>
								)}
							</div>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<Input
								label="Task Activity"
								variant="faded"
								className="w-full mb-4"
								ref={taskActivityRef}
								isDisabled={isSubtaskAdded}
							/>
							<Input
								label="Description"
								variant="faded"
								className="w-full mb-4"
								ref={taskDescriptionRef}
								isDisabled={isSubtaskAdded}
							/>
							<Collapsible open={isSubtaskAdded}>
								<CollapsibleTrigger className="w-full mb-4">
									<div className="flex justify-between">
										<Button
											variant="ghost"
											className={`${isSubtaskAdded ? "" : "w-full"} ${
												isSubtaskAdded ? "mb-4" : ""
											}`}
											onPress={() => {
												setIsSubtaskAdded(!isSubtaskAdded);
											}}
										>
											{isSubtaskAdded ? "Cancel" : "Add Subtask"}
										</Button>
										{isSubtaskAdded && (
											<Button onPress={handleAddSubtask}>Add</Button>
										)}
									</div>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<Input
										label="Subtask Activity"
										variant="faded"
										className="w-full mb-4"
										ref={subtaskActivityRef}
									/>
									<Input
										label="Description"
										variant="faded"
										className="w-full mb-4"
										ref={subtaskDescriptionRef}
									/>
								</CollapsibleContent>
							</Collapsible>
						</CollapsibleContent>
					</Collapsible>
					{!isTaskAdded && (
						<div className="flex justify-end">
							<Button variant="light" onPress={() => props.onCloseModal()}>
								Cancel
							</Button>
							<Button
								type="submit"
								color="secondary"
								variant="light"
								disabled={Object.keys(errors).length > 0}
							>
								Save
							</Button>
						</div>
					)}
				</form>
			)}
		</>
	);
}

export default AddNewChecklistUse;
//! refer here for conventional way of using react hook form https://github.com/HamedBahram/next-rhf/blob/main/components/rhf.tsx
//! https://www.youtube.com/watch?v=R_Pj593TH_Q minute 9:00

{
	/* <div className="mb-4">
					<Controller
						name="color"
						control={control}
						defaultValue={null}
						render={({ field }) => (
							<Select
								{...field}
								className="w-full"
								variant="faded"
								label="Color"
							>
								{colorChoice.map((color: ColorChoice) => (
									<SelectItem key={color.hex} value={color.hex}>
										{color.name}
									</SelectItem>
								))}
							</Select>
						)}
					/>
				</div> */
}
{
	/* <ListboxWrapper>
				<Listbox>
					<ListboxItem key="new">New file</ListboxItem>
				</Listbox>
			</ListboxWrapper> */
}
