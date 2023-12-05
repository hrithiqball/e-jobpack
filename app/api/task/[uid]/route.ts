import { prisma } from "@/prisma/prisma";
import { ResponseMessage } from "@/lib/result";
import { task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @description Validator for updating a task
 */
const UpdateTaskSchema = z.object({
	task_activity: z.string().optional(),
	description: z.string().optional(),
	is_complete: z.boolean().optional(),
	remarks: z.string().optional(),
	issue: z.string().optional(),
	deadline: z.date().optional(),
	completed_by: z.string().optional(),
	task_order: z.number().optional(),
	have_subtask: z.boolean().optional(),
	task_selected: z.string().array().optional(),
});

/**
 * @description Type for updating an task
 */
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the task.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task.
 */
export async function GET(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	const uid = params.uid;
	const task: task | null = await prisma.task.findUnique({
		where: { uid },
	});

	if (task) {
		return new NextResponse(
			JSON.stringify(
				ResponseMessage(200, `Successfully fetched task ${uid}!`, task)
			),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} else {
		return new NextResponse(
			JSON.stringify(ResponseMessage(404, `Task ${uid} not found`)),
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
 * @param {string} uid - The unique identifier of the task.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task.
 */
export async function PATCH(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		let json = await nextRequest.json();

		const result = UpdateTaskSchema.safeParse(json);
		console.log(result);

		if (result.success) {
			const updateTaskValue: UpdateTask = result.data;
			const updatedTask: task = await prisma.task.update({
				where: { uid },
				data: updateTaskValue,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully updated task ${updatedTask.uid}`,
						updatedTask
					)
				),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			console.error(result.error.message);
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
		console.error(error);
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Task ${params.uid} not found.`,
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
 * @param {string} uid - The unique identifier of the task.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task.
 */
export async function DELETE(
	nextRequest: NextRequest,
	{ params }: { params: { uid: string } }
): Promise<NextResponse> {
	try {
		const uid = params.uid;
		await prisma.task.delete({
			where: { uid },
		});

		return new NextResponse(
			JSON.stringify(ResponseMessage(200, `Task ${uid} deleted`)),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						404,
						`Task ${params.uid} not found`,
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
