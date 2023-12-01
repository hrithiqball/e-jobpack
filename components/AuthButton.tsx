"use client";

import { Button, Link } from "@nextui-org/react";
import React from "react";

function AuthButton() {
	return (
		<Button as={Link} href="/sign-in">
			Sign In
		</Button>
	);
}

export default AuthButton;
