"use client";

import React from "react";
import {
	Card,
	Button,
	Input,
	CardHeader,
	Image,
	Divider,
	Link,
} from "@nextui-org/react";

const AuthCard = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<Card title="Login / Sign Up" className="w-64 p-4 shadow-md">
				<CardHeader className="flex gap-3">
					<Image
						alt="Asset Management System"
						height={40}
						radius="sm"
						src="../favicon.ico"
						width={40}
					/>
					<p className="text-md">Asset Management System</p>
				</CardHeader>
				<Divider />
				<Input placeholder="Email" className="mt-4 mb-4" />
				<Input type="password" placeholder="Password" className="mb-4" />
				<Divider />
				<Button
					as={Link}
					href="/dashboard"
					variant="solid"
					className="w-full mt-4"
				>
					Login
				</Button>
				<Link href="/sign-up" className="text-blue-500 hover:underline mt-4">
					Sign Up
				</Link>
			</Card>
		</div>
	);
};

export default AuthCard;
