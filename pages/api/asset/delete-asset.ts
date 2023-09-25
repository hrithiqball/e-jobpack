import { UidAsset } from "@/models/asset";
import { prisma } from "@/lib/initPrisma";
import { NextApiRequest, NextApiResponse } from "next";
import ResponseMessage from "@/lib/result";
import { asset } from "@prisma/client";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "DELETE") {
		res.setHeader("Allow", ["DELETE"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);

		return;
	}

	const result = UidAsset.safeParse(req.body);

	if (result.success) {
		try {
			const asset: asset = await prisma.asset.delete({
				where: {
					uid: result.data.uid,
				},
			});

			if (asset) {
				const message = `Asset ${asset.uid} deleted`;
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
