import { NextApiRequest, NextApiResponse } from "next";
import { AddAssetSchema } from "@/models/asset";
import { asset } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import ResponseMessage from "@/lib/result";
import moment from "moment";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);

		return;
	}

	const result = AddAssetSchema.safeParse(req.body);

	if (result.success) {
		try {
			const request: asset = {
				...result.data,
				uid: `ASSET-${moment().format("YYMMDDHHmmssSSS")}`,
				updated_on: new Date(),
				created_on: new Date(),
				updated_by: result.data.created_by,
			};
			const target: asset = await prisma.asset.create({
				data: request,
			});

			console.info(`Created asset ${JSON.stringify(target)}`);

			res
				.status(201)
				.json(
					ResponseMessage(
						201,
						`Asset ${target.uid} has been saved into the database`,
						target
					)
				);
		} catch (error) {
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
