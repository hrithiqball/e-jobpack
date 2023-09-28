import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { asset } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
	request: Request,
	{ params }: { params: { uid: string } }
) {
	const uid = params.uid;
	const asset = await prisma.asset.findUnique({
		where: { uid },
	});

	if (asset) {
		return new NextResponse(
			JSON.stringify(
				ResponseMessage(200, `Successfully fetched asset for ${uid}!`, asset)
			),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} else {
		return new NextResponse(
			JSON.stringify(
				ResponseMessage(404, `Asset with ${params.uid} not found`)
			),
			{
				status: 404,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { uid: string } }
) {
	try {
		const uid = params.uid;
		let json = await request.json();

		const result = UpdateAssetSchema.safeParse(json);

		if (result.success) {
			const updateAssetValue: UpdateAsset = result.data;
			const updatedAsset: asset = await prisma.asset.update({
				where: { uid },
				data: updateAssetValue,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully updated asset ${uid}`,
						updatedAsset
					)
				),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return (
				new NextResponse(
					JSON.stringify(
						ResponseMessage(
							400,
							result.error.issues.map((issue) => issue.message).join(", "),
							null,
							result.error.issues.map((issue) => issue.code.toString()).join("")
						)
					)
				),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Asset uid ${params.uid} not found.`,
						null,
						error.message
					)
				),
				{
					status: 404,
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

export async function DELETE(
	request: Request,
	{ params }: { params: { uid: string } }
) {
	try {
		const uid = params.uid;
		await prisma.asset.delete({
			where: { uid },
		});

		return new NextResponse(
			JSON.stringify(ResponseMessage(204, `No uid provided`)),
			{ status: 204 }
		);
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Asset uid ${params.uid} not found`,
						null,
						error.message
					)
				),
				{
					status: 404,
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
 * Validator for updating an asset
 */
const UpdateAssetSchema = z.object({
	uid: z.string(),
	name: z.string().optional(),
	type: z.string().optional(),
	description: z.string().optional(),
});

/**
 * Type for updating an asset
 */
type UpdateAsset = z.infer<typeof UpdateAssetSchema>;
