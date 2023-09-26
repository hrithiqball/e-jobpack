import { Prisma, asset } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import { UidAsset, FilterAsset } from "@/models/asset";
import ResponseMessage from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const page_str = request.nextUrl.searchParams.get("page");
	const limit_str = request.nextUrl.searchParams.get("limit");
	const type = request.nextUrl.searchParams.get("type");
	const location = request.nextUrl.searchParams.get("location");
	const sort_by = request.nextUrl.searchParams.get("sort_by");
	const is_ascending = request.nextUrl.searchParams.get("is_ascending");
	const upcoming_maintenance = request.nextUrl.searchParams.get(
		"upcoming_maintenance"
	);

	const filters: Prisma.assetWhereInput[] = [];
	const orderBy: Prisma.assetOrderByWithRelationInput[] = [];

	if (type) {
		filters.push({ type });
	}
	if (location) {
		filters.push({ location });
	}
	if (upcoming_maintenance) {
		filters.push({
			next_maintenance: {
				gte: new Date(upcoming_maintenance),
			},
		});
	}

	const page = page_str ? parseInt(page_str, 10) : 1;
	const limit = limit_str ? parseInt(limit_str, 10) : 10;
	const isAscending = !!is_ascending;
	const sortBy = sort_by || "updated_on";
	const skip = (page - 1) * limit;

	if (sortBy) {
		if (isAscending) {
			orderBy.push({
				[sortBy]: "asc",
			});
		} else {
			orderBy.push({
				[sortBy]: "desc",
			});
		}
	} else {
		orderBy.push({
			updated_on: "desc",
		});
	}

	const asset = await prisma.asset.findMany({
		skip,
		take: limit,
		orderBy: {
			updated_on: "desc",
		},
	});

	let json_response = {
		status: "success",
		results: asset.length,
		data: asset,
	};
	return NextResponse.json(json_response);
}

export async function POST(request: Request) {
	try {
		const json = await request.json();

		const asset = await prisma.asset.create({
			data: json,
		});

		let json_response = {
			status: "success",
			asset,
		};

		return new NextResponse(JSON.stringify(json_response), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error: any) {
		if (error.code === "P2002") {
			let error_response = {
				status: "fail",
				message: "Feedback with title already exists",
			};
			return new NextResponse(JSON.stringify(error_response), {
				status: 409,
				headers: { "Content-Type": "application/json" },
			});
		}

		let error_response = {
			status: "error",
			message: error.message,
		};
		return new NextResponse(JSON.stringify(error_response), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	if (req.method !== "POST") {
// 		res.setHeader("Allow", ["POST"]);
// 		res.status(405).end(`Method ${req.method} Not Allowed`);

// 		return;
// 	}

// 	const result = AddAssetSchema.safeParse(req.body);

// 	if (result.success) {
// 		try {
// 			const request: asset = {
// 				...result.data,
// 				uid: `ASSET-${moment().format("YYMMDDHHmmssSSS")}`,
// 				updated_on: new Date(),
// 				created_on: new Date(),
// 				updated_by: result.data.created_by,
// 			};
// 			const target: asset = await prisma.asset.create({
// 				data: request,
// 			});

// 			console.info(`Created asset ${JSON.stringify(target)}`);

// 			res
// 				.status(201)
// 				.json(
// 					ResponseMessage(
// 						201,
// 						`Asset ${target.uid} has been saved into the database`,
// 						target
// 					)
// 				);
// 		} catch (error) {
// 			console.error(error);
// 			if (error instanceof Error) {
// 				res.status(500).json(ResponseMessage(500, error.message));
// 			} else {
// 				res.status(500);
// 			}
// 		} finally {
// 			await prisma.$disconnect();
// 		}
// 	} else {
// 		res
// 			.status(400)
// 			.json(
// 				ResponseMessage(
// 					400,
// 					result.error.issues.map((issue) => issue.message).join(", "),
// 					null,
// 					result.error.issues.map((issue) => issue.code.toString()).join("")
// 				)
// 			);

// 		return;
// 	}
// }
