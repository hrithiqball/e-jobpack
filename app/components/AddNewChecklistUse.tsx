import { Button, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { asset, checklist_use, subtask, task } from "@prisma/client";
import React, { useState } from "react";
import { Result } from "@/lib/result";
import { Controller, useForm } from "react-hook-form";
import { AddChecklistUseClient } from "../api/checklist-use/route";
import { IconChoice, iconChoice } from "@/public/icon-choice";

interface NestedTask {
	task: task;
	subtask?: subtask[];
}

function AddNewChecklistUse(props: {
	asset: asset;
	onCloseModal: (checklistUse?: checklist_use) => void;
}) {
	const [isSaving, setIsSaving] = useState(false);
	const [tasks, setTasks] = useState<NestedTask[]>([]);
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm();

	async function onSubmit(data: any) {
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
				setTimeout(() => {
					setIsSaving(false);
				}, 4000);
				props.onCloseModal(result.data!);
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
						<Controller
							name="title"
							control={control}
							defaultValue={""}
							render={({ field }) => (
								<Input
									label="Title"
									variant="faded"
									{...field}
									className="w-full"
								/>
							)}
						/>
						<p className="text-red-500">{errors.root?.message}</p>
					</div>
					<div className="mb-4">
						<Controller
							name="description"
							control={control}
							defaultValue={""}
							render={({ field }) => (
								<Input
									label="Description"
									variant="faded"
									{...field}
									className="w-full"
								/>
							)}
						/>
					</div>
					{/* <div className="mb-4">
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
				</div> */}
					<div className="mb-4">
						<Controller
							name="icon"
							control={control}
							defaultValue={null}
							render={({ field }) => (
								<Select
									{...field}
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
							)}
						/>
					</div>
					<div className="mb-4">
						<Button variant="ghost" className="w-100">
							Add Task
						</Button>
					</div>
					<div className=""></div>
					<div className="flex justify-end">
						<Button variant="light" onPress={() => props.onCloseModal()}>
							Cancel
						</Button>
						<Button type="submit" color="secondary" variant="light">
							Save
						</Button>
					</div>
				</form>
			)}
		</>
	);
}

export default AddNewChecklistUse;

{
	/* <ListboxWrapper>
				<Listbox>
					<ListboxItem key="new">New file</ListboxItem>
				</Listbox>
			</ListboxWrapper> */
}
