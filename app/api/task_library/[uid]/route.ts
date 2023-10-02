import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { task_library } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @description Validator for updating a task_library
 */
const UpdateTaskLibrarySchema = z.object({
	updated_by: z.string(),
	task_activity: z.string().optional(),
	description: z.string().optional(),
	task_order: z.number().optional(),
	have_subtask: z.boolean().optional(),
});

/**
 * @description Type for updating an task_library
 */
type UpdateTaskLibrary = z.infer<typeof UpdateTaskLibrarySchema> & {
	updated_on: Date;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the task_library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_library.
 */
export async function GET(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	const uid = params.uid;
	const taskLibrary: task_library | null = await prisma.task_library.findUnique(
		{
			where: { uid },
		}
	);

	if (taskLibrary) {
		return new NextResponse(
			JSON.stringify(
				ResponseMessage(
					200,
					`Successfully fetched task_library ${uid}!`,
					taskLibrary
				)
			),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} else {
		return new NextResponse(
			JSON.stringify(ResponseMessage(404, `Task library ${uid} not found`)),
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
 * @param {string} uid - The unique identifier of the task_library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_library.
 */
export async function PATCH(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		let json = await nextRequest.json();

		const result = UpdateTaskLibrarySchema.safeParse(json);

		if (result.success) {
			const updateTaskLibraryValue: UpdateTaskLibrary = {
				...result.data,
				updated_on: new Date(),
			};
			const updatedTaskLibrary: task_library = await prisma.task_library.update(
				{
					where: { uid },
					data: updateTaskLibraryValue,
				}
			);

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully updated task_library ${updatedTaskLibrary.uid}`,
						updatedTaskLibrary
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
						`Task library ${params.uid} not found.`,
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
 * @param {string} uid - The unique identifier of the task_library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_library.
 */
export async function DELETE(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		await prisma.task_library.delete({
			where: { uid },
		});

		return new NextResponse(
			JSON.stringify(ResponseMessage(200, `Task library ${uid} deleted`)),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Task library ${params.uid} not found`,
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
