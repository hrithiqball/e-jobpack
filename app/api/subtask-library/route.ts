import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma/db';
import dayjs from 'dayjs';

/**
 * @description Validate the request body for adding a new subtask_library
 */
const AddSubtaskLibrarySchema = z.object({
  createdBy: z.string(),
  taskActivity: z.string(),
  taskOrder: z.number(),
  description: z.string().optional(),
});

/**
 * @description Type for adding a new subtask_library
 */
type AddSubtaskLibrary = z.infer<typeof AddSubtaskLibrarySchema> & {
  id: string;
  updatedBy: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_library.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const subtaskLibraries = await db.subtaskLibrary.findMany();

    if (subtaskLibraries.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${subtaskLibraries.length} subtask_library`,
            subtaskLibraries,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No subtask libraries found`)),
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
        id: `ST-${dayjs().format('YYMMDDHHmmssSSS')}`,
        updatedBy: result.data.createdBy,
      };

      const subtaskLibrary = await db.subtaskLibrary.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Subtask ${subtaskLibrary.id} has been successfully created`,
            subtaskLibrary,
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
        JSON.stringify(ResponseMessage(409, `Subtask library already existed`)),
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
