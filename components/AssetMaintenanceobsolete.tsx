import React, { useEffect, useState } from "react";
import { asset, maintenance } from "@prisma/client";
import { Result } from "@/lib/result";
import {
	Accordion,
	AccordionItem,
	Card,
	CardBody,
	CardHeader,
} from "@nextui-org/react";
import SkeletonList from "./SkeletonList";
import ChecklistMaintenance from "./ChecklistMaintenance";

function AssetMaintenance(props: asset) {
	const [maintenances, setMaintenances] = useState<maintenance[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response: Response = await fetch(
					`/api/maintenance?asset${props.uid}`,
					{
						method: "GET",
					}
				);
				const result: Result<maintenance[]> = await response.json();

				if (result.statusCode === 200) {
					setMaintenances(result.data!);
					console.log(result.message);
				} else {
					console.log(result.message);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [props.uid]);

	return (
		<div>
			<Card className="rounded-md p-4 m-4 flex-grow">
				{isLoading ? (
					<>
						{Array(6)
							.fill(null)
							.map((_, index) => (
								<SkeletonList key={index} />
							))}
					</>
				) : (
					<>
						{maintenances.map((maintenance: maintenance) => (
							<Card className="py-4" key={maintenance.uid}>
								<CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
									<p className="text-tiny uppercase font-bold">Daily Mix</p>
									<small className="text-default-500">12 Tracks</small>
									<h4 className="font-bold text-large">Frontend Radio</h4>
								</CardHeader>
								<CardBody className="overflow-visible py-2">
									<ChecklistMaintenance {...maintenance} />
								</CardBody>
							</Card>
						))}
					</>
				)}
			</Card>
		</div>
	);
}

export default AssetMaintenance;
