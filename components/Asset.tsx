"use client";

import {
	Avatar,
	AvatarGroup,
	Button,
	Card,
	Divider,
	Link,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { asset, checklist_use, maintenance } from "@prisma/client";
import { IoIosArrowBack } from "react-icons/io";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { AiOutlineEdit, AiOutlinePlusSquare } from "react-icons/ai";
import Image from "next/image";
import moment from "moment";

export default function Asset({
	asset,
	maintenanceList,
	checklistUse,
}: {
	asset: asset;
	maintenanceList: maintenance[];
	checklistUse: checklist_use[];
}) {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return <Loading label="Hang on tight" />;

	return (
		<Card
			className={`rounded-md p-4 m-4 flex-grow ${
				theme === "dark" ? "bg-gray-800" : "bg-gray-200"
			}`}
		>
			<Button
				className="max-w-min"
				as={Link}
				href="/asset"
				startContent={<IoIosArrowBack />}
				variant="faded"
			>
				Back
			</Button>
			<div className="flex flex-row justify-between items-center mb-4">
				<span>{asset.name}</span>
				<div className="flex flex-row">
					<div className="flex flex-row">
						<Button isIconOnly variant="faded">
							<BsFillPersonBadgeFill />
						</Button>
						<Button isIconOnly className="ml-1" variant="faded">
							<AiOutlineEdit />
						</Button>
						<Button isIconOnly className="ml-1" variant="faded">
							<AiOutlinePlusSquare />
						</Button>
					</div>
				</div>
			</div>
			<Divider />
			<Card className="rounded-md overflow-hidden my-4">
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
						<h2 className="text-xl font-semibold">{asset.name}</h2>
						<Divider />
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
			</Card>
			{/* <Image
				alt={asset.name}
				src={
					"https://www.nu-heat.co.uk/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg"
				}
				width={500}
				height={800}
			/> */}
			{/* <div className="flex p-4">
				<div className="flex flex-col flex-1">
					<span className="text-sm">Description</span>
					<span className="text-lg">{asset.description}</span>
				</div>
				<div className="flex flex-col flex-1">
					<span className="text-sm">Type</span>
					<span className="text-lg">{asset.type}</span>
				</div>
				<div className="flex flex-col flex-1">
					<span className="text-sm">Created By</span>
					<span className="text-lg">{asset.created_by}</span>
				</div>
				<div className="flex flex-col flex-1">
					<span className="text-sm">Created On</span>
					<span className="text-lg">{asset.created_on.toString()}</span>
				</div>
			</div> */}
		</Card>
	);
}
