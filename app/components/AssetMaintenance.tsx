"use client";

import React, { useEffect, useState } from "react";
import { asset, maintenance } from "@prisma/client";
import { Result } from "@/lib/result";
import { Accordion, AccordionItem, Card } from "@nextui-org/react";
import SkeletonList from "./SkeletonList";
import ChecklistMaintenance from "./ChecklistMaintenance";

function AssetMaintenance(props: asset) {
	const [maintenances, setMaintenances] = useState<maintenance[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response: Response = await fetch("/api/maintenance", {
					method: "GET",
				});
				const result: Result<maintenance[]> = await response.json();

				if (response.status === 200) {
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
	}, []);

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
					<Accordion variant="splitted">
						{maintenances.map((maintenance: maintenance) => (
							<AccordionItem
								key={maintenance.uid}
								aria-label={maintenance.uid}
								title={props.uid}
								subtitle={
									<>
										<p>{maintenance.approved_by ?? "Not approved"}</p>
									</>
								}
							>
								{/* <ChecklistMaintenance {...maintenance} /> */}
							</AccordionItem>
						))}
					</Accordion>
				)}
			</Card>
		</div>
	);
}

export default AssetMaintenance;
