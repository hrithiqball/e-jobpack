import { Result } from "@/lib/result";
import { NestedTask, NestedTaskServer } from "@/model/nested-task";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { checklist_use, subtask_use, task_use } from "@prisma/client";
import React, { useEffect, useState } from "react";

function AssetChecklistUseDetails(props: {
	checklistUse: checklist_use;
	isOpen: boolean;
	onClose: () => void;
}) {
	const [nestedTask, setNestedTask] = useState<NestedTaskServer[]>([]);

	async function fetchTasks() {
		try {
			const response: Response = await fetch(
				`/api/task-use?checklistUseUid=${props.checklistUse.uid}`,
				{
					method: "GET",
				}
			);
			const result: Result<task_use[]> = await response.json();

			if (result.statusCode === 200) {
				if (result.data === undefined) throw new Error("No data found");
				await fetchSubtasks(result.data);
			} else if (result.statusCode === 204) {
				setNestedTask([]);
			} else {
				console.log(result.message);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function fetchSubtasks(taskUses: task_use[]) {
		try {
			taskUses.forEach(async (taskUse: task_use) => {
				const newNestedTask: NestedTaskServer = {
					taskUse: taskUse,
				};

				if (!taskUse.have_subtask) {
					nestedTask.push(newNestedTask);
					return;
				} else {
					const response: Response = await fetch(
						`/api/subtask-use?taskUseUid=${taskUse.uid}`,
						{
							method: "GET",
						}
					);
					const result: Result<subtask_use[]> = await response.json();

					if (result.statusCode === 200) {
						newNestedTask.subtaskUse = result.data;
						nestedTask.push(newNestedTask);
					} else {
						console.log(result.message);
					}
				}
			});
		} catch (error) {}
	}

	if (props.isOpen === true) {
		console.log(nestedTask);
	}

	return (
		<Modal backdrop="blur" isOpen={props.isOpen}>
			<ModalContent>
				<ModalHeader>Checklist Use Details</ModalHeader>
				<ModalBody>{props.checklistUse.title}</ModalBody>
				<ModalFooter>
					<Button onPress={props.onClose}>Close</Button>
					<Button
						onPress={() => {
							console.log(nestedTask);
							console.log(props.checklistUse.uid);
						}}
					>
						Edit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default AssetChecklistUseDetails;
