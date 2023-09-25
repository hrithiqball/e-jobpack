import { comparePassword } from "@/lib/comparePassword";
import { supabase } from "@/lib/initSupabase";
import { SignInUser, SignInUserSchema } from "@/models/user";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	const result = SignInUserSchema.safeParse(req.body);

	if (!result.success) {
		res.status(400).json({
			status: "Bad Request",
			message: result.error.issues.map((issue) => issue.message).join(", "),
			hint: result.error.issues.map((issue) => issue.code),
		});

		return;
	}

	const prisma = new PrismaClient();

	try {
		const request: SignInUser = {
			...result.data,
		};

		const target = await prisma.user.findUnique({
			where: { email: request.email },
		});

		if (!target) {
			res.status(404).json({
				status: "Not Found",
				message: `User ${request.email} not found`,
			});

			return;
		} else {
			const isMatched: boolean = await comparePassword(
				request.password,
				target.password
			);

			if (!isMatched) {
				res.status(401).json({
					status: "Unauthorized",
					message: "Password is incorrect",
				});
			}

			const auth = await supabase.auth.signInWithPassword({
				email: request.email,
				password: target.password,
			});

			if (auth.error) throw new Error(auth.error.message);

			res.status(200).json({
				status: "OK",
				message: `User ${target.uid} has been signed in`,
				token: auth.data.session.access_token,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: "Internal Server Error",
			message: error,
		});
	} finally {
		await prisma.$disconnect();
	}
}
