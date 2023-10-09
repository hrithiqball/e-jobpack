import { Result } from "@/lib/result";
import { Button, useDisclosure } from "@nextui-org/react";
import { asset, checklist_use } from "@prisma/client";
import React, { useEffect, useState } from "react";
import AddNewChecklistUse from "./AddNewChecklistUse";

function AssetChecklistUse(props: asset) {
	const [isLoading, setIsLoading] = useState(false);
	const [checklistUses, setChecklistUses] = useState<checklist_use[]>([]);
	const [isError, setIsError] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

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
			<Button>Add New Checklist</Button>
			<AddNewChecklistUse asset={props} isOpen={isOpen} onClose={onClose} />
		</>
	);
}

export default AssetChecklistUse;
