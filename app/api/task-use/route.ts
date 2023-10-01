import { task_use } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import moment from "moment";

/**
 * @description Validate the request body for adding a new task_use
 */
const AddTaskSchema = z.object({
	task_activity: z.string(),
	description: z.string().optional(),
	task_order: z.number(),
	have_subtask: z.boolean(),
	checklist_use_uid: z.string(),
	task_library_uid: z.string().optional(),
});

//  uid: string;
//  task_activity: string;
//  description: string | null;
//  task_order: bigint;
//  have_subtask: boolean;
//  checklist_use_uid: string;
//  task_library_uid: string | null;

/**
 * @description Type for adding a new task_use
 */
type AddTask = z.infer<typeof AddTaskSchema> & {
	uid: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_use.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const tasks: task_use[] = await prisma.task_use.findMany();

		if (tasks.length > 0) {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully fetched ${tasks.length} tasks`,
						tasks
					)
				),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new NextResponse(
				JSON.stringify(ResponseMessage(204, `No tasks found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {task_use}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_use.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const json = await nextRequest.json();

		const result = AddTaskSchema.safeParse(json);
		if (result.success) {
			const request: AddTask = {
				...result.data,
				uid: `TSUSE-${moment().format("YYMMDDHHmmssSSS")}`,
			};

			const task_use: task_use = await prisma.task_use.create({
				data: request,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						201,
						`Task ${task_use.uid} has been successfully created`,
						task_use
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
				JSON.stringify(ResponseMessage(409, `Task already existed`)),
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
