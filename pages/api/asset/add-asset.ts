import { NextApiRequest, NextApiResponse } from "next";
import { AddAssetSchema, AddAsset } from "@/models/asset";
import { PrismaClient } from "@prisma/client";
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

	if (!result.success) {
		res.status(400).json({
			status: "Bad Request",
			message: result.error.issues.map((issue) => issue.message).join(", "),
			hint: result.error.issues.map((issue) => issue.code),
		});
		return;
	}

	const prisma = new PrismaClient();
	const request: AddAsset = {
		...result.data,
		uid: `ASSET-${moment().format("YYMMDDHHmmssSSS")}`,
		updated_on: new Date(),
		created_on: new Date(),
		updated_by: result.data.created_by,
	};

	try {
		const target = await prisma.asset.create({
			data: request,
		});

		console.info(`Created asset ${JSON.stringify(target)}`);

		res.status(201).json({
			status: "Created",
			message: `Asset ${target.uid} has been saved into the database`,
			data: target,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "Internal server error", message: error });
	} finally {
		await prisma.$disconnect();
	}
}
