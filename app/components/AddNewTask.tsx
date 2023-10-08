import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

function AddNewTask(props: { isOpen: boolean; onClose: () => void }) {
	const [isSaving, setIsSaving] = useState(false);
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm();

	async function onSubmit(data: any) {
		console.log("submit");
	}

	return (
		<Modal backdrop="blur" isOpen={props.isOpen} onOpenChange={props.onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						{isSaving ? (
							<div className="flex flex-col items-center justify-center text-center p-4">
								<Spinner></Spinner>
							</div>
						) : (
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader>Add New Task</ModalHeader>
								<ModalBody>
									<div className="mb-4">
										<Controller
											name="taskActivity"
											control={control}
											defaultValue=""
											render={({ field }) => (
												<Input
													isRequired
													label="Task Activity"
													variant="faded"
													{...field}
													className="w-full"
												/>
											)}
										/>
										<p className="text-red-500">{errors.root?.message}</p>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button onPress={onClose}>Cancel</Button>
									<Button type="submit" color="secondary" variant="light">
										Save
									</Button>
								</ModalFooter>
							</form>
						)}
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default AddNewTask;
