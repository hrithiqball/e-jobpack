import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import moment from 'moment';
import { db } from '@/lib/prisma/db';

/**
 * @description Validate the request body for adding a new task_library
 */
const AddTaskLibrarySchema = z.object({
  createdBy: z.string(),
  taskActivity: z.string(),
  description: z.string().optional(),
  haveSubtask: z.boolean(),
  taskOrder: z.number(),
});

/**
 * @description Type for adding a new task_library
 */
type AddTaskLibrary = z.infer<typeof AddTaskLibrarySchema> & {
  id: string;
  updatedBy: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_library.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const taskLibraries = await db.taskLibrary.findMany();

    if (taskLibraries.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${taskLibraries.length} tasks`,
            taskLibraries,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No tasks found`)),
        {
          status: 204,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify(ResponseMessage(500, error.message ?? error)),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
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
        id: `TSL-${moment().format('YYMMDDHHmmssSSS')}`,
        updatedBy: result.data.createdBy,
      };

      const taskLibrary = await db.taskLibrary.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Task ${taskLibrary.id} has been successfully created`,
            taskLibrary,
          ),
        ),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            400,
            result.error.issues.map(issue => issue.message).join(', '),
            null,
            result.error.issues.map(issue => issue.code.toString()).join(''),
          ),
        ),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return new NextResponse(
        JSON.stringify(ResponseMessage(409, `Task already existed`)),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new NextResponse(
      JSON.stringify(ResponseMessage(500, error.message)),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
