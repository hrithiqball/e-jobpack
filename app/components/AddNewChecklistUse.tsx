import {
	Listbox,
	ListboxItem,
	Modal,
	ModalContent,
	ModalHeader,
} from "@nextui-org/react";
import { asset, checklist_use } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { ListboxWrapper } from "./ListBoxWrapper";
import { NextResponse } from "next/server";
import { Result } from "@/lib/result";

function AddNewChecklistUse(props: {
	asset: asset;
	isOpen: boolean;
	onClose: () => void;
}) {
	const [checklistUse, setChecklistUse] = useState<checklist_use[]>([]);

	useEffect(() => {
		async function fetchData() {
			try {
				const response: Response = await fetch("/api/checklist-use", {
					method: "GET",
				});
				const result: Result<checklist_use[]> = await response.json();

				if (result.statusCode === 200) {
					setChecklistUse(result.data!);
				} else if (result.statusCode === 204) {
					setChecklistUse([]);
				} else {
					console.log(result.message);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}
	}, []);

	return (
		<Modal>
			<ModalContent>
				{(onClose) => (
					<>
						{
							<form>
								<ModalHeader>Adding New Checklist</ModalHeader>
								<ListboxWrapper>
									<Listbox>
										<ListboxItem key="new">New file</ListboxItem>
									</Listbox>
								</ListboxWrapper>
							</form>
						}
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default AddNewChecklistUse;
