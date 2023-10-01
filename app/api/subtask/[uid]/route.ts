import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { subtask } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @description Validator for updating a subtask
 */
const UpdateSubtaskSchema = z.object({
	task_activity: z.string().optional(),
	description: z.string().optional(),
	is_complete: z.boolean().optional(),
	remarks: z.string().optional(),
	issue: z.string().optional(),
	deadline: z.date().optional(),
	completed_by: z.string().optional(),
	task_order: z.number().optional(),
});

/**
 * @description Type for updating an subtask
 */
type UpdateSubtask = z.infer<typeof UpdateSubtaskSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the subtask.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask.
 */
export async function GET(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	const uid = params.uid;
	const subtask: subtask | null = await prisma.subtask.findUnique({
		where: { uid },
	});

	if (subtask) {
		return new NextResponse(
			JSON.stringify(
				ResponseMessage(200, `Successfully fetched subtask ${uid}!`, subtask)
			),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} else {
		return new NextResponse(
			JSON.stringify(ResponseMessage(404, `Subtask ${uid} not found`)),
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
 * @param {string} uid - The unique identifier of the subtask.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask.
 */
export async function PATCH(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		let json = await nextRequest.json();

		const result = UpdateSubtaskSchema.safeParse(json);

		if (result.success) {
			const updateSubtaskValue: UpdateSubtask = result.data;
			const updatedSubtask: subtask = await prisma.subtask.update({
				where: { uid },
				data: updateSubtaskValue,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully updated subtask ${updatedSubtask.uid}`,
						updatedSubtask
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
						`Subtask ${params.uid} not found.`,
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
 * @param {string} uid - The unique identifier of the subtask.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask.
 */
export async function DELETE(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		await prisma.subtask.delete({
			where: { uid },
		});

		return new NextResponse(
			JSON.stringify(ResponseMessage(200, `Subtask ${uid} deleted`)),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Subtask ${params.uid} not found`,
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
