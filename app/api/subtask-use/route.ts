import { subtask_use } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import moment from "moment";

/**
 * @description Validate the request body for adding a new subtask_use
 */
const AddSubtaskUseSchema = z.object({
	task_activity: z.string(),
	task_order: z.number(),
	description: z.string().optional(),
	subtask_library_uid: z.string().optional(),
	task_use_uid: z.string(),
});

export type AddSubtaskUseClient = Omit<
	z.infer<typeof AddSubtaskUseSchema>,
	"task_use_uid"
>;

export type AddSubtaskUseServer = z.infer<typeof AddSubtaskUseSchema>;

/**
 * @description Type for adding a new subtask_use
 */
type AddSubtaskUse = z.infer<typeof AddSubtaskUseSchema> & {
	uid: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_use.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const subtasksUse: subtask_use[] = await prisma.subtask_use.findMany();

		if (subtasksUse.length > 0) {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						200,
						`Successfully fetched ${subtasksUse.length} subtask_use`,
						subtasksUse
					)
				),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new NextResponse(
				JSON.stringify(ResponseMessage(204, `No subtasks use found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {subtask_use}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_use.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
	try {
		const json = await nextRequest.json();

		const result = AddSubtaskUseSchema.safeParse(json);
		if (result.success) {
			const request: AddSubtaskUse = {
				...result.data,
				uid: `STUSE-${moment().format("YYMMDDHHmmssSSS")}`,
			};

			const subtaskUse: subtask_use = await prisma.subtask_use.create({
				data: request,
			});

			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						201,
						`Subtask use ${subtaskUse.uid} has been successfully created`,
						subtaskUse
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
