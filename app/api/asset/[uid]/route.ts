import { prisma } from "@/prisma/prisma";
import { ResponseMessage } from "@/lib/result";
import { asset } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @description Validator for updating an asset
 */
const UpdateAssetSchema = z.object({
	uid: z.string(),
	name: z.string().optional(),
	type: z.string().optional(),
	description: z.string().optional(),
});

/**
 * @description Type for updating an asset
 */
type UpdateAsset = z.infer<typeof UpdateAssetSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the asset.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset.
 */
export async function GET(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	const uid = params.uid;
	const asset: asset | null = await prisma.asset.findUnique({
		where: { uid },
	});

	if (asset) {
		return new NextResponse(
			JSON.stringify(
				ResponseMessage(200, `Successfully fetched asset ${uid}`, asset)
			),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} else {
		return new NextResponse(
			JSON.stringify(ResponseMessage(404, `Asset ${uid} not found`)),
			{
				status: 404,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

/**
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the asset.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset.
 */
export async function PATCH(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		let json = await nextRequest.json();

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
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Asset ${params.uid} not found.`,
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
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the asset.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset.
 */
export async function DELETE(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		await prisma.asset.delete({
			where: { uid },
		});

		return new NextResponse(
			JSON.stringify(ResponseMessage(200, `Asset ${uid} deleted`)),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Asset ${params.uid} not found`,
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
