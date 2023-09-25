import { UpdateUser, UpdateUserSchema } from "@/models/user";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "PATCH") {
		res.setHeader("Allow", ["PATCH"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);

		return;
	}

	const result = UpdateUserSchema.safeParse(req.body);

	if (!result.success) {
		res.status(400).json({
			status: "Bad Request",
			message: result.error.issues.map((issue) => issue.message).join(", "),
			hint: result.error.issues.map((issue) => issue.code),
		});

		return;
	}

	const prisma = new PrismaClient();
	const request: UpdateUser = result.data as UpdateUser;

	try {
		const target = await prisma.user.update({
			where: {
				uid: request.uid,
			},
			data: {
				...request,
				uid: undefined,
				email: undefined,
			},
		});

		res.status(200).json({
			status: "OK",
			message: `User ${target.uid} has been updated`,
			data: target,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "Internal server error", message: error });
	} finally {
		await prisma.$disconnect();
	}
}
