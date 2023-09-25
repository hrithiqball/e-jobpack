import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { UidAsset } from "@/models/asset";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	const result = UidAsset.safeParse(req.query);

	if (!result.success) {
		res.status(400).json({
			status: "Bad Request",
			message: result.error.issues.map((issue) => issue.message).join(", "),
			hint: result.error.issues.map((issue) => issue.code),
		});

		return;
	} else {
		const prisma = new PrismaClient();
		const request = result.data.uid;

		try {
			const asset = await prisma.asset.findUnique({
				where: {
					uid: request,
				},
			});

			if (asset) {
				const message = `Asset ${asset.uid} found`;
				console.info(message);
				res.status(200).json({
					status: "OK",
					message: message,
					data: asset,
				});

				return;
			} else {
				const message = `Asset ${request} not found`;
				console.error(message);
				res.status(404).json({
					status: "Not Found",
					message: message,
				});

				return;
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error", error: error });
		} finally {
			await prisma.$disconnect();
		}
	}
}
