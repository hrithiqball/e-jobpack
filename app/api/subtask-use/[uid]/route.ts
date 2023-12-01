import { prisma } from "@/prisma/prisma";
import { ResponseMessage } from "@/lib/result";
import { subtask_use } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @description Validator for updating a subtask_use
 */
const UpdateSubtaskUseSchema = z.object({
	task_activity: z.string().optional(),
	description: z.string().optional(),
	task_order: z.number().optional(),
	subtask_library_uid: z.string().optional(),
});

/**
 * @description Type for updating an subtask_use
 */
type UpdateSubtaskUse = z.infer<typeof UpdateSubtaskUseSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the subtask_use.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_use.
 */
export async function GET(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	const uid = params.uid;
	const subtaskUse: subtask_use | null = await prisma.subtask_use.findUnique({
		where: { uid },
	});

	if (subtaskUse) {
		return new NextResponse(
			JSON.stringify(
				ResponseMessage(
					200,
					`Successfully fetched subtask use ${uid}!`,
					subtaskUse
				)
			),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} else {
		return new NextResponse(
			JSON.stringify(ResponseMessage(404, `Subtask use ${uid} not found`)),
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
 * @param {string} uid - The unique identifier of the subtask_use.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_use.
 */
export async function PATCH(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		let json = await nextRequest.json();

		const result = UpdateSubtaskUseSchema.safeParse(json);

		if (result.success) {
			const updateSubtaskUseValue: UpdateSubtaskUse = result.data;
			const updatedSubtaskUse: subtask_use = await prisma.subtask_use.update({
				where: { uid },
				data: updateSubtaskUseValue,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully updated subtask_use ${updatedSubtaskUse.uid}`,
						updatedSubtaskUse
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
						`Subtask use ${params.uid} not found.`,
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
 * @param {string} uid - The unique identifier of the subtask_use.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_use.
 */
export async function DELETE(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		await prisma.subtask_use.delete({
			where: { uid },
		});

		return new NextResponse(
			JSON.stringify(ResponseMessage(200, `Subtask use ${uid} deleted`)),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Subtask use ${params.uid} not found`,
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
