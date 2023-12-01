import { task_library } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import { ResponseMessage } from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import moment from "moment";

/**
 * @description Validate the request body for adding a new task_library
 */
const AddTaskLibrarySchema = z.object({
	created_by: z.string(),
	task_activity: z.string(),
	description: z.string().optional(),
	have_subtask: z.boolean(),
	task_order: z.number(),
});

/**
 * @description Type for adding a new task_library
 */
type AddTaskLibrary = z.infer<typeof AddTaskLibrarySchema> & {
	uid: string;
	created_on: Date;
	updated_by: string;
	updated_on: Date;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_library.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const taskLibraries: task_library[] = await prisma.task_library.findMany();

		if (taskLibraries.length > 0) {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully fetched ${taskLibraries.length} tasks`,
						taskLibraries
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {task_library}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_library.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const json = await nextRequest.json();

		const result = AddTaskLibrarySchema.safeParse(json);
		if (result.success) {
			const request: AddTaskLibrary = {
				...result.data,
				uid: `TSL-${moment().format("YYMMDDHHmmssSSS")}`,
				created_on: new Date(),
				updated_by: result.data.created_by,
				updated_on: new Date(),
			};

			const taskLibrary: task_library = await prisma.task_library.create({
				data: request,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						201,
						`Task ${taskLibrary.uid} has been successfully created`,
						taskLibrary
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
