import { NextApiRequest, NextApiResponse } from "next";
import { UpdateAsset, UpdateAssetSchema } from "../../../models/asset";
import { PrismaClient } from "@prisma/client";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "PATCH") {
		res.setHeader("Allow", ["PATCH"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	const result = UpdateAssetSchema.safeParse(req.body);

	if (!result.success) {
		res.status(400).json({
			status: "Bad Request",
			message: result.error.issues.map((issue) => issue.message).join(", "),
			hint: result.error.issues.map((issue) => issue.code),
		});
		return;
	}

	const prisma = new PrismaClient();
	const request: UpdateAsset = result.data as UpdateAsset;

	try {
		const target = await prisma.asset.update({
			where: {
				uid: request.uid,
			},
			data: {
				...request,
				uid: undefined,
			},
		});

		res.status(200).json({
			status: "OK",
			message: `Asset ${target.uid} has been updated`,
			data: target,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	} finally {
		await prisma.$disconnect();
	}
}
