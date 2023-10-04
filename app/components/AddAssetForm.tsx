"use client";

import React, { useEffect, useState } from "react";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Spinner,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { AddAssetClient } from "../api/asset/route";
import { asset, asset_type } from "@prisma/client";
import { Result } from "@/lib/result";

function AddAssetForm(props: { isOpen: boolean; onClose: () => void }) {
	const sessionUser = "USER-230925140418609";
	const [type, setType] = useState<asset_type[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		const sampleChoices: asset_type[] = [
			{
				uid: "ASTYPE-1",
				created_on: new Date(),
				created_by: "",
				updated_on: new Date(),
				title: "Option 2",
				description: null,
				icon: null,
				updated_by: "",
			},
			{
				uid: "ASTYPE-1",
				created_on: new Date(),
				created_by: "",
				updated_on: new Date(),
				title: "Option 1",
				description: null,
				icon: null,
				updated_by: "",
			},
		];
		return () => {
			setType(sampleChoices);
		};
	}, []);

	async function onSubmit(data: any) {
		setIsSaving(true);
		const newAsset: AddAssetClient = {
			name: data.name,
			description: data.description ?? null,
			type: data.type ?? null,
			created_by: sessionUser,
			last_maintenance: data.last_maintenance ?? null,
			next_maintenance: data.next_maintenance ?? null,
			last_maintainee: data.last_assignee ?? [],
			location: data.location ?? null,
			status_uid: data.status ?? null,
			person_in_charge: data.person_in_charge ?? null,
		};

		try {
			const response: Response = await fetch("/api/asset", {
				method: "POST",
				body: JSON.stringify(newAsset),
			});
			const result: Result<asset> = await response.json();

			if (result.statusCode === 201) {
				console.log(result.data);
			} else if (result.statusCode === 204) {
				console.log(result.message);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setTimeout(() => {
				setIsSaving(false);
			}, 4000);
			props.onClose();
		}
	}

	return (
		<Modal backdrop="blur" isOpen={props.isOpen} onOpenChange={props.onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						{isSaving ? (
							<div className="flex flex-col items-center justify-center text-center p-4">
								<Spinner color="success" />
								<span className="ml-2">Saving your new asset</span>
							</div>
						) : (
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader>Adding New Asset</ModalHeader>
								<ModalBody>
									<div className="mb-4">
										<Controller
											name="name"
											control={control}
											defaultValue=""
											render={({ field }) => (
												<Input
													isRequired
													label="Name"
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
											defaultValue=""
											render={({ field }) => (
												<Input
													label="Description"
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
											name="type"
											control={control}
											defaultValue=""
											render={({ field }) => (
												<>
													<Select
														{...field}
														className="w-full"
														variant="faded"
														label="Type"
													>
														{type.map((type) => (
															<SelectItem key={type.uid} value={type.uid}>
																{type.title}
															</SelectItem>
														))}
													</Select>
												</>
											)}
										/>
										<p className="text-red-500">{errors.root?.message}</p>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button variant="light" onPress={onClose}>
										Cancel
									</Button>
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

export default AddAssetForm;
