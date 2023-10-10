import { Result } from "@/lib/result";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import { asset, checklist_use } from "@prisma/client";
import React, { useEffect, useState } from "react";
import AddNewChecklistUse from "./AddNewChecklistUse";

function AssetChecklistUse(asset: asset) {
	const [isLoading, setIsLoading] = useState(false);
	const [checklistUses, setChecklistUses] = useState<checklist_use[]>([]);
	const [isError, setIsError] = useState(false);
	const [addChecklistUse, setAddChecklistUse] = useState(false);

	useEffect(() => {
		async function fetchData() {
			try {
				const response: Response = await fetch("/api/checklist-use", {
					method: "GET",
				});
				const result: Result<checklist_use[]> = await response.json();

				if (result.statusCode === 200) {
					setChecklistUses(result.data!);
				} else if (result.statusCode === 204) {
					setChecklistUses([]);
				} else {
					setIsError(true);
				}
			} catch (error) {
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, []);

	function handleChecklistModalClose(checklistUse?: checklist_use) {
		if (checklistUse) {
			checklistUses.push(checklistUse);
		}
		setAddChecklistUse(false);
	}

	return (
		<>
			{checklistUses.length > 0 ? (
				checklistUses.map((checklistUse) => (
					<Button key={checklistUse.uid}>{checklistUse.title}</Button>
				))
			) : (
				<p className="font-normal p-4">
					No checklist is set for this asset yet. Create one now!
				</p>
			)}
			<Button
				onPress={() => {
					setAddChecklistUse(true);
				}}
			>
				Add New Checklist
			</Button>
			<Modal isOpen={addChecklistUse} onClose={() => setAddChecklistUse(false)}>
				<ModalContent>
					<ModalHeader>Add New Checklist</ModalHeader>
					<ModalBody>
						<AddNewChecklistUse
							asset={asset}
							onCloseModal={handleChecklistModalClose}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}

export default AssetChecklistUse;
