import { subtask } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import moment from "moment";

/**
 * @description Validate the request body for adding a new subtask
 */
const AddSubtaskSchema = z.object({
	task_activity: z.string(),
	task_uid: z.string(),
	task_order: z.number(),
	description: z.string().optional(),
	remarks: z.string().optional(),
	issue: z.string().optional(),
	deadline: z.date().optional(),
});

/**
 * @description Type for adding a new subtask
 */
type AddSubtask = z.infer<typeof AddSubtaskSchema> & {
	uid: string;
	is_complete: boolean;
	completed_by: string | null;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const subtasks: subtask[] = await prisma.subtask.findMany();

		if (subtasks.length > 0) {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully fetched ${subtasks.length} subtask`,
						subtasks
					)
				),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new NextResponse(
				JSON.stringify(ResponseMessage(204, `No subtasks found`)),
				{
					status: 204,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	} catch (error: any) {
		return new NextResponse(
			JSON.stringify(ResponseMessage(500, error.message ?? error)),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

/**
 * This asynchronous function handles POST requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {subtask}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const json = await nextRequest.json();

		const result = AddSubtaskSchema.safeParse(json);
		if (result.success) {
			const request: AddSubtask = {
				...result.data,
				uid: `CL-${moment().format("YYMMDDHHmmssSSS")}`,
				is_complete: false,
				completed_by: null,
			};

			const subtask: subtask = await prisma.subtask.create({
				data: request,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						201,
						`Subtask ${subtask.uid} has been successfully created`,
						subtask
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
				JSON.stringify(ResponseMessage(409, `Subtask already existed`)),
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
