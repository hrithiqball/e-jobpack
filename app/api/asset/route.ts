import { Prisma, asset } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import moment from "moment";

export async function GET(request: NextRequest) {
	// filter params (all optional)
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

	const assets: asset[] = await prisma.asset.findMany({
		skip,
		take: limit,
		orderBy: {
			updated_on: "desc",
		},
	});

	let json_response = {
		status: "success",
		results: assets.length,
		data: assets,
	};
	return NextResponse.json(json_response);
}

export async function POST(request: Request) {
	try {
		const json = await request.json();

		const result = AddAssetSchema.safeParse(json);
		if (result.success) {
			const req: AddAsset = {
				...result.data,
				uid: `ASSET-${moment().format("YYMMDDHHmmssSSS")}`,
				updated_on: new Date(),
				created_on: new Date(),
				updated_by: result.data.created_by,
			};

			const asset: asset = await prisma.asset.create({
				data: req,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						201,
						`Asset ${req.uid} has been successfully created`,
						asset
					)
				),
				{
					status: 201,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						400,
						result.error.issues.map((issue) => issue.message).join(", "),
						null,
						result.error.issues.map((issue) => issue.code.toString()).join("")
					)
				),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse(
				JSON.stringify(ResponseMessage(409, `Asset already existed`)),
				{
					status: 409,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		return new NextResponse(
			JSON.stringify(ResponseMessage(500, error.message)),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

/**
 * Schema for adding a new asset
 */
const AddAssetSchema = z.object({
	name: z.string(),
	description: z.string(),
	type: z.string().nullable(),
	created_by: z.string(),
	last_maintenance: z.date().nullable(),
	next_maintenance: z.date().nullable(),
	last_maintainee: z.array(z.string()),
	location: z.string().nullable(),
	status_uid: z.string().nullable(),
	person_in_charge: z.string().nullable(),
});

/**
 * Type for adding a new asset
 */
type AddAsset = z.infer<typeof AddAssetSchema> & {
	uid: string;
	updated_on: Date;
	created_on: Date;
	updated_by: string;
};
