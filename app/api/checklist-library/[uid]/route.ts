import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { checklist_library } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @description Validator for updating an checklist-library
 */
const UpdateChecklistLibrarySchema = z.object({
	updated_by: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	color: z.string().optional(),
	icon: z.string().optional(),
});

/**
 * @description Type for updating an checklist-library
 */
type UpdateChecklistLibrary = z.infer<typeof UpdateChecklistLibrarySchema> & {
	updated_on: Date;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the checklist-library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist-library.
 */
export async function GET(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	const uid = params.uid;
	const checklistLibrary: checklist_library | null =
		await prisma.checklist_library.findUnique({
			where: { uid },
		});

	if (checklistLibrary) {
		return new NextResponse(
			JSON.stringify(
				ResponseMessage(
					200,
					`Successfully fetched checklist-library ${uid}!`,
					checklistLibrary
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
				ResponseMessage(404, `Checklist library ${uid} not found`)
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
 * @param {string} uid - The unique identifier of the checklist library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist-library.
 */
export async function PATCH(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		let json = await nextRequest.json();

		const result = UpdateChecklistLibrarySchema.safeParse(json);

		if (result.success) {
			const updateChecklistLibraryValue: UpdateChecklistLibrary = {
				...result.data,
				updated_on: new Date(),
			};
			const updatedChecklistLibrary: checklist_library =
				await prisma.checklist_library.update({
					where: { uid },
					data: updateChecklistLibraryValue,
				});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully updated checklist-library type ${uid}`,
						updatedChecklistLibrary
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
						`Checklist library ${params.uid} not found.`,
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
 * @param {string} uid - The unique identifier of the checklist-library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist-library.
 */
export async function DELETE(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		await prisma.checklist_library.delete({
			where: { uid },
		});

		return new NextResponse(
			JSON.stringify(ResponseMessage(200, `Checklist library ${uid} deleted`)),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Checklist-library ${params.uid} not found`,
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
