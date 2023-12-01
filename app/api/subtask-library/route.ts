import { subtask_library } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import { ResponseMessage } from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import moment from "moment";

/**
 * @description Validate the request body for adding a new subtask_library
 */
const AddSubtaskLibrarySchema = z.object({
	created_by: z.string(),
	task_activity: z.string(),
	task_order: z.number(),
	description: z.string().optional(),
});

/**
 * @description Type for adding a new subtask_library
 */
type AddSubtaskLibrary = z.infer<typeof AddSubtaskLibrarySchema> & {
	uid: string;
	created_on: Date;
	updated_on: Date;
	updated_by: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_library.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const subtaskLibraries: subtask_library[] =
			await prisma.subtask_library.findMany();

		if (subtaskLibraries.length > 0) {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully fetched ${subtaskLibraries.length} subtask_library`,
						subtaskLibraries
					)
				),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new NextResponse(
				JSON.stringify(ResponseMessage(204, `No subtask libraries found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {subtask_library}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_library.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const json = await nextRequest.json();

		const result = AddSubtaskLibrarySchema.safeParse(json);
		if (result.success) {
			const request: AddSubtaskLibrary = {
				...result.data,
				uid: `ST-${moment().format("YYMMDDHHmmssSSS")}`,
				created_on: new Date(),
				updated_on: new Date(),
				updated_by: result.data.created_by,
			};

			const subtaskLibrary: subtask_library =
				await prisma.subtask_library.create({
					data: request,
				});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						201,
						`Subtask ${subtaskLibrary.uid} has been successfully created`,
						subtaskLibrary
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
				JSON.stringify(ResponseMessage(409, `Subtask library already existed`)),
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
