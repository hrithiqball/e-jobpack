import { ResponseMessage } from "@/lib/result";
import { UpdateUser, UpdateUserSchema } from "@/models/user";
import { prisma } from "@/lib/initPrisma";
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

	if (result.success) {
		try {
			const request: UpdateUser = result.data as UpdateUser;
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

			res
				.status(200)
				.json(
					ResponseMessage(200, `User ${target.uid} has been updated`, target)
				);
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
