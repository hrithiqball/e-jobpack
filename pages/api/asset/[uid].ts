import { NextApiRequest, NextApiResponse } from "next";
import { asset } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import { UidAsset } from "@/models/asset";
import ResponseMessage from "@/lib/result";

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

	if (result.success) {
		try {
			const asset: asset | null = await prisma.asset.findUnique({
				where: {
					uid: result.data.uid,
				},
			});

			if (asset) {
				const message = `Asset ${asset.uid} found`;
				console.info(message);
				res.status(200).json(ResponseMessage(200, message, asset));

				return;
			} else {
				const message = `Asset ${result.data.uid} not found`;
				console.error(message);
				res.status(404).json(ResponseMessage(404, message));

				return;
			}
		} catch (error: unknown) {
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
