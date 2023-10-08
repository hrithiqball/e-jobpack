"use client";

import React from "react";
import Navigation from "../components/Navigation";
import { Button, Card, useDisclosure } from "@nextui-org/react";
import AddNewTask from "../components/AddNewTask";

function Task() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<div className="flex flex-col h-screen">
			<Navigation />
			<Card className="rounded-md bg-gray-200 p-4 m-4 flex-grow">
				<Button
					className="mb-4"
					color="primary"
					variant="shadow"
					onPress={onOpen}
				>
					Assign New Task
				</Button>
				<AddNewTask isOpen={isOpen} onClose={onClose} />
			</Card>
		</div>
	);
}

export default Task;
