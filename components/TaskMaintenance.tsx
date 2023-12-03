"use client";

import React, { useEffect, useState, useTransition } from "react";
import { NestedMaintenance } from "@/model/nested-maintenance";
import { useTheme } from "next-themes";
import Loading from "./Loading";
import { Button, Card, Checkbox, Divider } from "@nextui-org/react";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import { updateTaskCompletion } from "@/utils/actions/route";
import { maintenance } from "@prisma/client";

export default function TaskMaintenance({
	maintenance,
	children,
}: {
	maintenance: maintenance;
	children: React.ReactNode;
}) {
	let [isPending, startTransition] = useTransition();
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return <Loading label="Hang on tight" />;

	return (
		<Card
			className={`rounded-md p-4 m-4 flex-grow ${
				theme === "dark" ? "bg-gray-800" : "bg-gray-200"
			}`}
		>
			<div className="flex flex-row">
				<Button
					className="max-w-min"
					as={Link}
					href="/task"
					startContent={<IoIosArrowBack />}
					variant="faded"
					size="md"
				>
					Back
				</Button>
			</div>
			<div className="flex flex-row justify-between items-center my-4 ">
				<h2 className="text-xl font-semibold">{maintenance.uid}</h2>
				<div className="flex flex-row space-x-1">
					<Button isIconOnly variant="faded">
						<AiOutlineEdit />
					</Button>
					<Button isIconOnly variant="faded">
						<FaRegFilePdf />
					</Button>
					<Button isIconOnly variant="faded">
						<FaRegFileExcel />
					</Button>
				</div>
			</div>
			<Divider />
			<Card className="rounded-md overflow-hidden mt-4">
				<div className="flex flex-col h-screen p-4">
					<div className="flex-shrink-0 w-full">
						{children}
						{/* {nestedMaintenanceState.checklists.map((checklist) => (
							<Card key={checklist.uid} className="flex-1 h-full p-4">
								<p className="font-bold text-lg">{checklist.title}</p>
								<Divider />
								<div className="flex flex-col space-y-2 mt-4">
									{checklist.tasks.map((task) => (
										<div key={task.uid} className="flex gap-3 items-center">
											<Checkbox
												isSelected={task.is_complete}
												onValueChange={() => {
													const updatedTasks = checklist.tasks.map((t) =>
														t.uid === task.uid
															? {
																	...t,
																	is_complete: !t.is_complete,
															  }
															: t
													);

													const updatedChecklist = {
														...checklist,
														tasks: updatedTasks,
													};

													const updatedMaintenance = {
														...nestedMaintenance,
														checklists: nestedMaintenance.checklists.map((c) =>
															c.uid === updatedChecklist.uid
																? updatedChecklist
																: c
														),
													};

													setNestedMaintenanceState(updatedMaintenance);
													updateTask(task.uid, !task.is_complete);
													console.log("test", task.is_complete, task.uid);
												}}
											>
												{task.task_activity}
											</Checkbox>
										</div>
									))}
								</div>
							</Card>
						))} */}
					</div>
				</div>
			</Card>
		</Card>
	);
}
