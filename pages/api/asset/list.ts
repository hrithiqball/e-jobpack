import { NextApiRequest, NextApiResponse } from "next";
import { Prisma, asset } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import { FilterAsset } from "@/models/asset";
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

	const result = FilterAsset.safeParse(req.query);

	if (result.success) {
		try {
			const filters: Prisma.assetWhereInput[] = [];

			if (result.data.type) {
				filters.push({
					type: result.data.type,
				});
			}

			if (result.data.location) {
				filters.push({
					location: result.data.location,
				});
			}

			if (result.data.upcoming_maintenance) {
				filters.push({
					next_maintenance: {
						gte: result.data.upcoming_maintenance,
					},
				});
			}

			const orderBy: Prisma.assetOrderByWithRelationInput[] = [];
			if (result.data.sort_by) {
				if (result.data.is_ascending) {
					orderBy.push({
						[result.data.sort_by]: "asc",
					});
				} else {
					orderBy.push({
						[result.data.sort_by]: "desc",
					});
				}
			} else {
				orderBy.push({
					updated_on: "desc",
				});
			}

			const assets: asset[] = await prisma.asset.findMany({
				where: {
					AND: filters,
				},
				orderBy: orderBy,
				take: 25,
			});

			if (assets) {
				const message = `${assets.length} asset(s) found`;
				console.info(message);
				res.status(200).json(ResponseMessage(200, message, assets));

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
		res.status(400).json({
			status: "Bad Request",
			message: result.error.issues.map((issue) => issue.message).join(", "),
			hint: result.error.issues.map((issue) => issue.code),
		});

		return;
	}
}
