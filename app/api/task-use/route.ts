import { task_use } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import moment from "moment";

/**
 * @description Validate the request body for adding a new task_use
 */
const AddTaskUseSchema = z.object({
	task_activity: z.string(),
	description: z.string().optional(),
	task_order: z.number(),
	have_subtask: z.boolean(),
	checklist_use_uid: z.string(),
	task_library_uid: z.string().optional(),
});

export type AddTaskUseClient = Omit<
	z.infer<typeof AddTaskUseSchema>,
	"checklist_use_uid"
>;

export type AddTaskUseServer = z.infer<typeof AddTaskUseSchema>;

/**
 * @description Type for adding a new task_use
 */
type AddTaskUse = z.infer<typeof AddTaskUseSchema> & {
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
					status: 200,
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

		const result = AddTaskUseSchema.safeParse(json);
		if (result.success) {
			result.data.task_library_uid =
				result.data.task_library_uid == ""
					? undefined
					: result.data.task_library_uid;
			const request: AddTaskUse = {
				...result.data,
				uid: `TSUSE-${moment().format("YYMMDDHHmmssSSS")}`,
			};

			console.log(request);

			const taskUse: task_use = await prisma.task_use.create({
				data: request,
			});

			console.log(taskUse);

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						201,
						`Task ${taskUse.uid} has been successfully created`,
						taskUse
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
		console.log(error);
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
