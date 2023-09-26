import { comparePassword } from "@/lib/comparePassword";
import { supabase } from "@/lib/initSupabase";
import ResponseMessage from "@/lib/result";
import { SignInUser, SignInUserSchema } from "@/models/user";
import { user } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
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

	if (result.success) {
		try {
			const request: SignInUser = {
				...result.data,
			};

			const target: user | null = await prisma.user.findUnique({
				where: { email: request.email },
			});

			if (target) {
				const isMatched: boolean = await comparePassword(
					request.password,
					target.password
				);

				if (!isMatched) {
					res.status(401).json(ResponseMessage(401, "Password is not matched"));
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

				return;
			} else {
				res
					.status(404)
					.json(ResponseMessage(404, `User ${request.email} not found`));

				return;
			}
		} catch (error: unknown) {
			console.error(error);
			if (error instanceof Error) {
				res.status(500).json(ResponseMessage(500, error.message));
			} else {
				res.status(500);
			}
		} finally {
			await prisma.$disconnect();
		}
	} else {
		res
			.status(400)
			.json(
				ResponseMessage(
					400,
					result.error.issues.map((issue) => issue.message).join(", "),
					null,
					result.error.issues.map((issue) => issue.code.toString()).join("")
				)
			);

		return;
	}
}
