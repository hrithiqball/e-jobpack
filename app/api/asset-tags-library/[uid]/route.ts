import { prisma } from "@/prisma/prisma";
import { ResponseMessage } from "@/lib/result";
import { asset_tags_library } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @description Validator for updating an asset-tags in library
 */
const UpdateAssetTagsLibrarySchema = z.object({
	title: z.string().optional(),
	color: z.string().optional(),
	updated_by: z.string(),
});

/**
 * @description Type for updating an asset-tags in library
 */
type UpdateAssetTagsLibrary = z.infer<typeof UpdateAssetTagsLibrarySchema> & {
	updated_on: Date;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the asset-tags in library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags in library.
 */
export async function GET(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	const uid = params.uid;
	const assetTagsLibrary: asset_tags_library | null =
		await prisma.asset_tags_library.findUnique({
			where: { uid },
		});

	if (assetTagsLibrary) {
		return new NextResponse(
			JSON.stringify(
				ResponseMessage(
					200,
					`Successfully fetched asset-tags ${uid} from library`,
					assetTagsLibrary
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
				ResponseMessage(404, `Asset-tags ${uid} from library not found`)
			),
			{
				status: 404,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

/**
 *
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the asset-tags from library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags from library.
 */
export async function PATCH(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		let json = await nextRequest.json();

		const result = UpdateAssetTagsLibrarySchema.safeParse(json);

		if (result.success) {
			const updateAssetTagsValue: UpdateAssetTagsLibrary = {
				...result.data,
				updated_on: new Date(),
			};
			const updatedAssetTagsLibrary: asset_tags_library =
				await prisma.asset_tags_library.update({
					where: { uid },
					data: updateAssetTagsValue,
				});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully updated asset-tags ${uid} from library`,
						updatedAssetTagsLibrary
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
						`Asset-tag ${params.uid} not found from library.`,
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
 *
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the asset-tags from library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags from library.
 */
export async function DELETE(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		await prisma.asset_tags_library.delete({
			where: { uid },
		});

		return new NextResponse(
			JSON.stringify(
				ResponseMessage(200, `Asset-tags ${uid} deleted from library`)
			),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Asset-tags ${params.uid} not found from library`,
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
