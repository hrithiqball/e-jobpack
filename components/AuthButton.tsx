"use client";

import React from "react";
import { Button, Link } from "@nextui-org/react";

function AuthButton() {
	return (
		<Button as={Link} href="/sign-in">
			Sign In
		</Button>
	);
}

export default AuthButton;
