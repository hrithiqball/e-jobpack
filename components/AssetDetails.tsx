import { asset, checklist_use } from "@prisma/client";
import React from "react";
import Image from "next/image";
import moment from "moment";
import { Avatar, AvatarGroup } from "@nextui-org/react";

export default function AssetDetails({
	asset,
	checklistUse,
}: {
	asset: asset;
	checklistUse: checklist_use[];
}) {
	return (
		<div className="flex flex-row">
			<Image
				alt={asset.name}
				src={
					"https://www.nu-heat.co.uk/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg"
				}
				width={500}
				height={800}
				className="object-cover m-4 rounded-md"
			/>
			<div className="p-4">
				<table className="w-full mt-4">
					<tbody>
						<tr>
							<td className="font-semibold">Description</td>
							<td className="text-gray-500 pl-4">{asset.description}</td>
						</tr>
						<tr>
							<td className="font-semibold">Type</td>
							<td className="text-gray-500 pl-4">
								{asset.type === "" || asset.type === null
									? "Not Specified"
									: asset.type}
							</td>
						</tr>
						<tr>
							<td className="font-semibold">Next Maintenance</td>
							<td className="text-gray-500 pl-4">
								{asset.next_maintenance === null
									? "Not Specified"
									: moment(asset.next_maintenance).format("DD/MM/YYYY")}
							</td>
						</tr>
						<tr>
							<td className="font-semibold">Last Maintenance</td>
							<td className="text-gray-500 pl-4">
								{asset.last_maintenance === null
									? "Not Specified"
									: moment(asset.last_maintenance).format("DD/MM/YYYY")}
							</td>
						</tr>
						<tr className="mt-4">
							<td className="font-semibold">Last Maintainee</td>
							<td className="text-gray-500 pl-4">
								<AvatarGroup isBordered max={3}>
									<Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
									<Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
									<Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
									<Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
									<Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
									<Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
								</AvatarGroup>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
