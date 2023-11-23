"use client";

import React, { useEffect, useState } from "react";
import { ExtendedAsset } from "@/app/asset/page";
import { Button, Card, CardFooter, Divider } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { BiSolidBookAdd } from "react-icons/bi";
import Loading from "./Loading";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { AiOutlineEdit, AiOutlinePlusSquare } from "react-icons/ai";

function AssetComponent({ extendedAsset }: { extendedAsset: ExtendedAsset[] }) {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [openSideBar, setOpenSideBar] = useState(false);
	const [newMaintenance, setNewMaintenance] = useState(false);

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
			<div className="flex justify-between">
				<span>Asset List</span>
				<Button variant="ghost" size="sm" endContent={<BiSolidBookAdd />}>
					Add Asset
				</Button>
			</div>
			<div className="flex flex-row justify-between h-screen">
				<div className="flex-1">
					{extendedAsset.map((asset, index) => (
						<Button key={index} onClick={() => setOpenSideBar(!openSideBar)}>
							{asset.name}
						</Button>
					))}
				</div>
				{openSideBar && (
					<div
						className={`p-4 flex-1 mt-4 border rounded-md overflow-x-auto ${
							theme === "dark" ? "bg-gray-600" : "bg-gray-300"
						}`}
					>
						<div className="flex flex-row justify-between items-center">
							<span className="font-bold ml-4">Sample</span>
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
						<Divider className="mt-3" />

						{!newMaintenance && (
							<div className="p-4">
								<p>Description</p>
								<p>This is sample desc</p>
								<p>Checklist</p>
								<div className="flex flex-row overflow-x-auto items-center">
									<Card
										radius="lg"
										className={`border-none min-h-min min-w-min bg-red-400 mx-2 my-1`}
										shadow="sm"
									>
										<div className="p-4 mb-12">
											<h3 className="text-lg font-semibold">
												Sample checklist title
											</h3>
											<p className="text-tiny text-white/80">Sample Desc</p>
										</div>
										<CardFooter>
											<Button
												onClick={() => {
													// setCurrentChecklist
													setNewMaintenance(!newMaintenance);
												}}
											>
												New Maintenance
											</Button>
										</CardFooter>
									</Card>
									<Button className="min-w-min">Add New Checklist</Button>
								</div>
								<div className="mt-4">
									<p>Scheduled Maintenance</p>
									TODO: calendar here
								</div>
								<div className="mt-4">
									<p>Maintenance History</p>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</Card>
	);
}

export default AssetComponent;
