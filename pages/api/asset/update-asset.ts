import { NextApiRequest, NextApiResponse } from "next";
import { UpdateAsset, UpdateAssetSchema } from "../../../models/asset";
import { Prisma, asset } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import ResponseMessage from "@/lib/result";

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

	if (result.success) {
		try {
			const request: UpdateAsset = result.data as UpdateAsset;
			const target: asset = await prisma.asset.update({
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
		} catch (error: unknown) {
			console.error(error);
			if (error instanceof Error) {
				res.status(500).json(ResponseMessage(500, error.message));
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
