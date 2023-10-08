import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from "@nextui-org/react";
import React, { useState } from "react";

function AddNewTask(props: { isOpen: boolean; onClose: () => void }) {
	const [isSaving, setIsSaving] = useState(false);

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
							<form action="">
								<ModalHeader>Add New Task</ModalHeader>
								<ModalBody>Should be a form</ModalBody>
								<ModalFooter>
									<Button onPress={onClose}>Cancel</Button>
									<Button>Save</Button>
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
